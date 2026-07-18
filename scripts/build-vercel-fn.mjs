// Bundles the Vercel serverless entry point and writes the finished,
// fully self-contained JS directly into api/, which Vercel deploys as-is.
//
// The source deliberately lives OUTSIDE api/ (scripts/vercel-entry.ts) —
// Vercel's own build system treats api/ as a special Serverless Functions
// directory with its own (separate, isolated) build step, which raced our
// custom buildCommand and meant the bundler could never reliably find or
// write files there mid-build. Committing the pre-built output sidesteps
// that entirely: Vercel just serves the finished api/[...path].js file,
// nothing left to compile at deploy time.
//
// Run this manually after changing server/ code, then commit the updated
// api/[...path].js alongside the source change.
import { build } from "esbuild";
import { existsSync } from "fs";

const entry = "scripts/vercel-entry.ts";
// Plain filename, not api/[...path].js: Vercel's bracket catch-all filename
// convention isn't reliably supported outside Next.js's own build tooling —
// in testing it only matched a single path segment. vercel.json instead
// explicitly rewrites all /api/* traffic to this one function.
const outfile = "api/index.js";

if (!existsSync(entry)) {
  console.error(`build-vercel-fn: entry point not found at "${entry}" (cwd: ${process.cwd()})`);
  process.exit(1);
}

await build({
  entryPoints: [entry],
  platform: "node",
  bundle: true,
  format: "esm",
  outfile,
  banner: {
    js: "import { createRequire } from 'module';const require = createRequire(import.meta.url);",
  },
});

console.log(`build-vercel-fn: bundled ${entry} -> ${outfile}`);
