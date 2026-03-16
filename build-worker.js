import { build } from "esbuild";

await build({
  entryPoints: ["./worker.ts"],
  bundle: true,
  format: "esm",
  outfile: "build/client/_worker.js",
  conditions: ["workerd", "worker", "browser"],
  platform: "neutral",
  external: ["node:*"],
  mainFields: ["browser", "module", "main"],
  alias: {
    "virtual:react-router/server-build": "./build/server/index.js",
  },
});
