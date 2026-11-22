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

// Oxlint reads `@typescript-eslint/x` as `typescript/x`; rename so our settings replace nkzw's.
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
    ...nkzwOverrides.filter(({ files }) => files.every((glob) => glob.startsWith("**/"))),
    // ESLint built-ins replaced by their `typescript/` versions (`no-throw-literal` by `only-throw-error`).
    {
      files: typeScriptFiles,
      rules: setAll(["no-implied-eval", "no-throw-literal", "prefer-promise-reject-errors"], "off"),
    },
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
