import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { ENTRY } from "./main.ts";

const mainPath = fileURLToPath(new URL("./main.ts", import.meta.url));

function run(dir: string): string {
  execFileSync(process.execPath, [mainPath, dir]);
  return readFileSync(join(dir, "entry.txt"), "utf8");
}

test("entry.txt is deterministic and well formed", (t) => {
  const dir = mkdtempSync(join(tmpdir(), "entry-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));

  const first = run(dir);
  const second = run(dir);

  assert.equal(first, ENTRY);
  assert.equal(second, first);
  assert.equal(first.trim(), first);
  assert.ok(!first.includes("\n") && !first.includes("\r"));
  const chars = [...first].length;
  assert.ok(chars >= 1 && chars <= 200, `got ${chars} characters`);
});

test("writes to the directory given as argument", (t) => {
  const dir = mkdtempSync(join(tmpdir(), "entry-path-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));

  run(dir);
  assert.equal(readFileSync(join(dir, "entry.txt"), "utf8"), ENTRY);
});
