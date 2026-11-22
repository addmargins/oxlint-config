# @addmargins/oxlint-config

Oxlint preset that keeps agent-written code reviewable. Builds on [@nkzw/oxlint-config](https://github.com/nkzw-tech/oxlint-config) and adds type-checked rules and complexity limits.

## Error, never warn

Warnings get ignored. Every rule is an error: fix it or disable it inline.

## Usage

Requires Node 24+, Oxlint 1.94+, and `tsrs` (Oxlint's type-aware backend).

```sh
pnpm add -D @addmargins/oxlint-config oxlint tsrs
```

`oxlint.config.ts`:

```ts
import addmargins from "@addmargins/oxlint-config";
import { defineConfig } from "oxlint";

export default defineConfig({
  extends: [addmargins],
});
```

Run `pnpm oxlint`.

## Based on nkzw

Everything in [@nkzw/oxlint-config](https://github.com/nkzw-tech/oxlint-config): correctness, unicorn, import, React, React Hooks, no-instanceof, no-only-tests, and its `quality/` rules. Type-aware linting on. Unused disable comments are errors.

## Rules

Added on top of nkzw. All `error`. Type-aware rules run on TypeScript only.

| Rule                                                                                                                                               | Why                                                                   |
| -------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `typescript/no-unsafe-*` (`argument`, `assignment`, `call`, `member-access`, `return`, `enum-comparison`)                                          | No `any` leaking through.                                             |
| `typescript/no-base-to-string`, `restrict-plus-operands`, `restrict-template-expressions`                                                          | No `[object Object]` in strings.                                      |
| `typescript/await-thenable`, `require-await`, `no-misused-promises`                                                                                | Correct async. Async JSX handlers allowed.                            |
| `typescript/only-throw-error`, `prefer-promise-reject-errors`                                                                                      | Throw and reject `Error`s only.                                       |
| `typescript/no-implied-eval`, `no-namespace`, `no-this-alias`, `no-redundant-type-constituents`, `no-unnecessary-type-assertion`, `unbound-method` | Rest of typescript-eslint `recommended-type-checked` that nkzw skips. |
| `no-unused-vars`                                                                                                                                   | Prefix `_` to keep. `--fix` removes unused imports.                   |
| `complexity`                                                                                                                                       | **Max 13** per function.                                              |
| `max-depth`                                                                                                                                        | **Max 3** nested blocks.                                              |
