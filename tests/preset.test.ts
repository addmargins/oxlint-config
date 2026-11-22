import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "vite-plus/test";

const oxlintBin = join(
  dirname(createRequire(import.meta.url).resolve("oxlint/package.json")),
  "bin/oxlint",
);

// `vp test` sets VP_VERSION, which makes Oxlint read `vite.config.ts` instead of `-c`.
const { VP_VERSION: _vpVersion, ...env } = process.env;

test("resolved config", () => {
  const { stderr, stdout } = spawnSync(
    process.execPath,
    [oxlintBin, "-c", "preset.config.ts", "--print-config"],
    { cwd: fileURLToPath(new URL("fixtures/", import.meta.url)), encoding: "utf8", env },
  );
  expect(stderr).toBe("");
  expect(stdout).not.toContain('"warn"');

  // Read the diff before `-u`.
  // Omitted: `settings` (Oxlint defaults), `jsPlugins` (machine paths), `plugins` (already reflected in `rules`).
  const {
    jsPlugins: _jsPlugins,
    plugins: _plugins,
    settings: _settings,
    ...config
  } = JSON.parse(stdout) as Record<string, unknown>;
  expect(config).toMatchSnapshot();
});
