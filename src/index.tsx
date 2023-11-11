import { Hono } from "hono";
import { authenticator } from "otplib";
import { validator } from "hono/validator";

import { Layout } from "./components/foo";
import { memo } from "hono/jsx";

import {
  getCookie,
  getSignedCookie,
  setCookie,
  setSignedCookie,
  deleteCookie,
} from "hono/cookie";

const secret = process.env.OTP_SECRET as string;

const LOGGED_IN_COOKIE_NAME = "__session";

console.log(secret);

const app = new Hono();

app.use("/app", async (c, next) => {
  const loggedInCookie = await getSignedCookie(
    c,
    process.env.COOKIE_SIGNING_KEY as string,
    LOGGED_IN_COOKIE_NAME
  );
  if (!loggedInCookie) {
    await deleteCookie(c, LOGGED_IN_COOKIE_NAME);
    return c.redirect("/login", 302);
  }
  await next();
});

app.get("/app", (c) => {
  console.log(c.req);
  return c.html(<Layout>Welcome to the app</Layout>);
});

app.all("/logout", async (c) => {
  await deleteCookie(c, LOGGED_IN_COOKIE_NAME);
  return c.redirect("/login", 302);
});

app.get("/", (c) => c.html(<Layout>hi!</Layout>));

app.get("/login", (c) =>
  c.html(
    <Layout>
      <LoginForm />
    </Layout>
  )
);

const LoginForm = memo(() => (
  <form method="post">
    <input type="text" name="username" placeholder="username" />
    <input type="text" name="otp" placeholder="otp" />
    <button type="submit">Submit</button>
  </form>
));

app.post(
  "/login",
  validator("form", (value, c) => {
    const otp = value["otp"];
    const username = value["username"];
    if (
      !otp ||
      typeof otp !== "string" ||
      !username ||
      typeof username !== "string" ||
      !authenticator.check(otp, secret)
    ) {
      return c.html(
        <Layout>
          <span>Bad Credentials</span>
          <LoginForm />
        </Layout>,
        400
      );
    }
    return {
      otp: otp,
    };
  }),
  async (c) => {
    await setSignedCookie(
      c,
      LOGGED_IN_COOKIE_NAME,
      "blueberry",
      process.env.COOKIE_SIGNING_KEY as string,
      process.env.NODE_ENV === "production"
        ? {
            path: "/",
            secure: true,
            domain: "zapplebee.prettybirdserver.com",
            httpOnly: true,
            maxAge: 1000,
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
            sameSite: "Strict",
          }
        : undefined
    );
    return c.redirect("/app", 302);
  }
);

export default {
  port: 3400,
  fetch: app.fetch,
};
