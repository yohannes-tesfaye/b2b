import "dotenv/config";
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";

const url = new URL(process.env.DATABASE_URL || "");
const schema = url.searchParams.get("schema") || "public";
const outDir = process.env.BACKUP_DIR || resolve(process.cwd(), ".backups");
mkdirSync(outDir, { recursive: true });

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const file = resolve(outDir, `b2b-${schema}-${stamp}.dump`);

const args = [
  "-h", url.hostname,
  "-p", url.port || "5432",
  "-U", decodeURIComponent(url.username),
  "-d", url.pathname.slice(1),
  "-n", schema,
  "-Fc",
  "-f", file,
];

execFileSync("pg_dump", args, {
  env: { ...process.env, PGPASSWORD: decodeURIComponent(url.password || "") },
  stdio: "inherit",
});

console.log(`backup written: ${file}`);
