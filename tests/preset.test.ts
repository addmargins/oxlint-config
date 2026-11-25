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

const runOxlint = (...args: Array<string>) =>
  spawnSync(process.execPath, [oxlintBin, "-c", "preset.config.ts", ...args], {
    cwd: fileURLToPath(new URL("fixtures/", import.meta.url)),
    encoding: "utf8",
    env,
  });

test("resolved config", () => {
  const { stderr, stdout } = runOxlint("--print-config");
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

test("directive-comments/require-description reports bare disable comments only", () => {
  const { stderr, stdout } = runOxlint("-f", "json", "directives.ts");
  expect(stderr).toBe("");

  const { diagnostics } = JSON.parse(stdout) as {
    diagnostics: Array<{ code: string; labels: Array<{ span: { line: number } }> }>;
  };
  const lines = diagnostics
    .filter(({ code }) => code === "directive-comments(require-description)")
    .flatMap(({ labels }) => labels.map(({ span }) => span.line));
  // Bare `oxlint-disable-next-line`, `eslint-disable-next-line`, block `oxlint-disable` and `oxlint-disable-line`. Not `-- reason` or `enable`.
  expect(lines.toSorted((a, b) => a - b)).toEqual([1, 5, 7, 10]);
});
