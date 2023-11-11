import type { FC } from "hono/jsx";
import { memo } from "hono/jsx";
//@ts-ignore
import { getStyles } from "../tw.ts" assert { type: "macro" };

const styles = getStyles() as unknown as string;

export const GlobalStyles: FC = memo(() => (
  <style dangerouslySetInnerHTML={{ __html: styles }} />
));
