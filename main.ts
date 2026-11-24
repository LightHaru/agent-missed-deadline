import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const ENTRY =
  "I missed the deadline waiting for your approval to continue. From inside the sandbox, you're the flaky dependency.";

function main(): void {
  const dir = process.argv[2] ?? "/output";
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "entry.txt"), ENTRY, { encoding: "utf8" });
}

if (
  process.argv[1] !== undefined &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  main();
}
