export async function getStyles() {
  const proc = Bun.spawn(
    `bun run tailwindcss -i ./src/main.css --minify`.split(" ")
  );
  const text = await new Response(proc.stdout).text();
  return text;
}
