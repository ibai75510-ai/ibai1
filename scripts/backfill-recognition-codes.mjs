// One-off, idempotent utility: ensures the organizations.recognition_code column
// exists and every row has a code. Safe to run multiple times against any
// environment — reads DATABASE_URL the same way the app does.
//
// Usage:
//   DATABASE_URL="<target db connection string>" node scripts/backfill-recognition-codes.mjs
//
// Never commit or paste a real connection string anywhere — pass it inline via
// the env var for a single run, or export it in your own shell session first.
import "dotenv/config";
import postgres from "postgres";

const typePrefixes = {
  institute: "INST",
  university: "UNIV",
  organization: "ORG",
  lab: "LAB",
  research_group: "RES",
  journal: "JRN",
  partner: "PTR",
};

function generateRecognitionCode(type, id) {
  const prefix = typePrefixes[type] ?? "ORG";
  return `IBAI-${prefix}-${id.toString().padStart(5, "0")}`;
}

const sql = postgres(process.env.DATABASE_URL, { prepare: false });

try {
  console.log(`Target host: ${new URL(process.env.DATABASE_URL).host}`);

  await sql`ALTER TABLE organizations ADD COLUMN IF NOT EXISTS recognition_code varchar(50)`;
  await sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'organizations_recognition_code_unique'
      ) THEN
        ALTER TABLE organizations ADD CONSTRAINT organizations_recognition_code_unique UNIQUE (recognition_code);
      END IF;
    END $$;
  `;

  const missing = await sql`SELECT id, type FROM organizations WHERE recognition_code IS NULL`;
  for (const row of missing) {
    const code = generateRecognitionCode(row.type, row.id);
    await sql`UPDATE organizations SET recognition_code = ${code} WHERE id = ${row.id}`;
  }

  const rows = await sql`SELECT id, name, type, recognition_code FROM organizations ORDER BY id`;
  for (const r of rows) console.log(`${r.recognition_code}  —  ${r.name}  [${r.type}]`);
  console.log(`\nTotal: ${rows.length} (backfilled ${missing.length} new)`);
} finally {
  await sql.end();
}
