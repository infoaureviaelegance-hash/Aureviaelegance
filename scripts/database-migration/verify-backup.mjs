import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";

const backupDir = path.join(process.cwd(), "backups", "neon-migration");
const manifest = JSON.parse(await readFile(path.join(backupDir, "manifest.json"), "utf8"));
const counts = JSON.parse(await readFile(path.join(backupDir, "counts.json"), "utf8"));

const failures = [];
let totalRows = 0;

for (const [fileName, expected] of Object.entries(manifest.files)) {
  const payload = await readFile(path.join(backupDir, fileName), "utf8");
  const rows = JSON.parse(payload);
  const digest = createHash("sha256").update(payload).digest("hex");
  const table = fileName.replace(/\.json$/, "");

  if (!Array.isArray(rows)) failures.push(`${fileName}: payload is not an array`);
  if (rows.length !== expected.rows) failures.push(`${fileName}: manifest row count mismatch`);
  if (rows.length !== counts[table]) failures.push(`${fileName}: counts.json mismatch`);
  if (digest !== expected.sha256) failures.push(`${fileName}: SHA-256 mismatch`);
  totalRows += rows.length;
}

if (Object.keys(manifest.files).length !== manifest.tableCount) {
  failures.push("Manifest table count does not match the number of table files");
}
if (totalRows !== manifest.totalRows) failures.push("Manifest total row count mismatch");

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({ verified: true, tables: manifest.tableCount, totalRows }, null, 2));
}
