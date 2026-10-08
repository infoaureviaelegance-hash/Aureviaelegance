import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const root = process.cwd();
const backupDir = path.join(root, "backups", "neon-migration");

async function loadLocalDatabaseUrl() {
  if (process.env.OLD_DATABASE_URL || process.env.DATABASE_URL) return;

  const contents = await readFile(path.join(root, ".env"), "utf8");
  const line = contents
    .split(/\r?\n/)
    .find((entry) => entry.trim().startsWith("DATABASE_URL="));
  if (!line) throw new Error("DATABASE_URL is not set and was not found in .env");

  const value = line.slice(line.indexOf("=") + 1).trim();
  process.env.DATABASE_URL = value.replace(/^(["'])(.*)\1$/, "$2");
}

function json(value) {
  return JSON.stringify(
    value,
    (_key, item) => {
      if (typeof item === "bigint") return { $type: "BigInt", value: item.toString() };
      if (Buffer.isBuffer(item)) return { $type: "Buffer", value: item.toString("base64") };
      return item;
    },
    2,
  );
}

function quotePostgresIdentifier(value) {
  return `"${value.replaceAll('"', '""')}"`;
}

await loadLocalDatabaseUrl();
const sourceUrl = process.env.OLD_DATABASE_URL || process.env.DATABASE_URL;
if (!sourceUrl?.startsWith("postgres")) {
  throw new Error("Refusing export: source URL is not PostgreSQL");
}

const prisma = new PrismaClient({ datasourceUrl: sourceUrl });

try {
  await prisma.$queryRaw`SELECT 1`;
  await mkdir(backupDir, { recursive: true });

  const tables = await prisma.$queryRaw`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    ORDER BY table_name
  `;
  const columns = await prisma.$queryRaw`
    SELECT table_name, column_name, data_type, udt_name, is_nullable,
           column_default, ordinal_position
    FROM information_schema.columns
    WHERE table_schema = 'public'
    ORDER BY table_name, ordinal_position
  `;
  const constraints = await prisma.$queryRaw`
    SELECT tc.constraint_name, tc.constraint_type, tc.table_name,
           kcu.column_name, ccu.table_name AS foreign_table_name,
           ccu.column_name AS foreign_column_name
    FROM information_schema.table_constraints tc
    LEFT JOIN information_schema.key_column_usage kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    LEFT JOIN information_schema.constraint_column_usage ccu
      ON tc.constraint_name = ccu.constraint_name
      AND tc.table_schema = ccu.table_schema
    WHERE tc.table_schema = 'public'
    ORDER BY tc.table_name, tc.constraint_name, kcu.ordinal_position
  `;

  const counts = {};
  const files = {};

  for (const { table_name: tableName } of tables) {
    const identifier = quotePostgresIdentifier(tableName);
    const rows = await prisma.$queryRawUnsafe(`SELECT * FROM ${identifier}`);
    const payload = `${json(rows)}\n`;
    const fileName = `${tableName}.json`;
    await writeFile(path.join(backupDir, fileName), payload, "utf8");
    counts[tableName] = rows.length;
    files[fileName] = {
      rows: rows.length,
      sha256: createHash("sha256").update(payload).digest("hex"),
    };
  }

  const schemaPayload = `${json({ columns, constraints })}\n`;
  await writeFile(path.join(backupDir, "schema.json"), schemaPayload, "utf8");
  await writeFile(path.join(backupDir, "counts.json"), `${json(counts)}\n`, "utf8");
  await writeFile(
    path.join(backupDir, "manifest.json"),
    `${json({
      exportedAt: new Date().toISOString(),
      source: "Neon PostgreSQL (credentials omitted)",
      tableCount: tables.length,
      totalRows: Object.values(counts).reduce((sum, count) => sum + count, 0),
      files,
      schemaSha256: createHash("sha256").update(schemaPayload).digest("hex"),
    })}\n`,
    "utf8",
  );

  console.log(JSON.stringify({ tableCount: tables.length, counts }, null, 2));
} finally {
  await prisma.$disconnect();
}
