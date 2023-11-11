import type { FC } from "hono/jsx";
import { GlobalStyles } from "./globalStyles";

export const Layout: FC = (props) => {
  return (
    <html>
      <head>
        <GlobalStyles />
      </head>
      <body>
        <div class="grid bg-amber-800 text-red-400">{props.children}</div>
      </body>
    </html>
  );
};
