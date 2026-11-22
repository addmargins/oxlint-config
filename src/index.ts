import nkzw from "@nkzw/oxlint-config";
import type { DummyRuleMap, OxlintConfig } from "oxlint";

const allFiles = ["**/*"];
const typeScriptFiles = ["**/*.{ts,tsx,mts,cts}"];
const javaScriptFiles = ["**/*.{js,jsx,mjs,cjs}"];

// Rules in typescript-eslint's `recommended-type-checked` that nkzw leaves off.
const missingRecommendedRules = {
  syntactic: ["typescript/no-namespace", "typescript/no-this-alias"],
  typeAware: [
    "typescript/no-base-to-string",
    "typescript/no-implied-eval",
    "typescript/no-redundant-type-constituents",
    "typescript/no-unnecessary-type-assertion",
    "typescript/no-unsafe-argument",
    "typescript/no-unsafe-assignment",
    "typescript/no-unsafe-call",
    "typescript/no-unsafe-enum-comparison",
    "typescript/no-unsafe-member-access",
    "typescript/no-unsafe-return",
    "typescript/only-throw-error",
    "typescript/prefer-promise-reject-errors",
    "typescript/require-await",
    "typescript/restrict-plus-operands",
    "typescript/restrict-template-expressions",
    "typescript/unbound-method",
  ],
};

const setAll = (names: Array<string>, value: "error" | "off"): DummyRuleMap =>
  Object.fromEntries(names.map((name) => [name, value]));

// nkzw uses `@typescript-eslint/x`; Oxlint treats it as `typescript/x`.
// Rename to `typescript/` so our settings override nkzw's instead of competing with them.
const normalizeRules = (rules: DummyRuleMap = {}): DummyRuleMap =>
  Object.fromEntries(
    Object.entries(rules).map(([name, value]) => [
      name.replace(/^@typescript-eslint\//, "typescript/"),
      value,
    ]),
  );

const { env, overrides: nkzwOverrides = [], rules: nkzwRules, ...nkzwBase } = nkzw;

const config: OxlintConfig = {
  ...nkzwBase,
  overrides: [
    // Put `env` in an override so configs that extend this one keep it.
    { files: allFiles, env },
    // Drop nkzw's overrides for paths in its own repo, like `server/src/index.tsx`.
    ...nkzwOverrides
      .filter(({ files }) => files.every((glob) => glob.startsWith("**/")))
      .map((override) => ({ ...override, rules: normalizeRules(override.rules) })),
    // Turn off ESLint built-ins in TypeScript so their `typescript/` versions don't report twice.
    // `no-throw-literal` is replaced by `only-throw-error`.
    {
      files: typeScriptFiles,
      rules: setAll(["no-implied-eval", "no-throw-literal", "prefer-promise-reject-errors"], "off"),
    },
    // Turn off our type-aware rules in JavaScript, like typescript-eslint's `disable-type-checked`.
    {
      files: javaScriptFiles,
      rules: setAll(missingRecommendedRules.typeAware, "off"),
    },
  ],
  rules: {
    ...normalizeRules(nkzwRules),
    ...setAll(
      [...missingRecommendedRules.syntactic, ...missingRecommendedRules.typeAware],
      "error",
    ),
    "typescript/await-thenable": "error",
    "no-unused-vars": [
      "error",
      {
        args: "after-used",
        argsIgnorePattern: "^_",
        fix: { imports: "safe-fix", variables: "off" },
        varsIgnorePattern: "^_",
      },
    ],
    // `attributes: false` allows async JSX handlers.
    "typescript/no-misused-promises": ["error", { checksVoidReturn: { attributes: false } }],
    complexity: ["error", { max: 13 }],
    "max-depth": ["error", { max: 3 }],
  },
};

export default config;
