// Bundles the Vercel serverless entry point directly via esbuild's JS API
// instead of its CLI. This sidesteps any shell-specific quoting/globbing of
// the bracketed catch-all filename ("api/[...path].ts") entirely, since the
// path is passed as a plain JS string rather than parsed by a shell.
import { build } from "esbuild";
import { unlinkSync, existsSync } from "fs";

const entry = "api/[...path].ts";
const outfile = "api/[...path].js";

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

unlinkSync(entry);
console.log(`build-vercel-fn: bundled ${entry} -> ${outfile}`);
