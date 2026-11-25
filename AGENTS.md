# Snapshot Test

`tests/__snapshots__/preset.test.ts.snap` records the config Oxlint resolves from this preset. It should change only when `@nkzw/oxlint-config` or `oxlint` is upgraded.

Read the diff before running `vp test -u`, and check that:

- Our rules and options still win over nkzw's.
- TypeScript and JavaScript overrides stay separate.

If either fails, fix `src/index.ts` or stop and report. Running `-u` without review accepts every change.

# Dependency PR Titles

The PR title sets the release version. Pick by what the snapshot diff does to users. Highest row wins.

| Snapshot diff                                                      | Title                                 |
| ------------------------------------------------------------------ | ------------------------------------- |
| None                                                               | `fix(deps):`                          |
| Nothing users see                                                  | `fix(deps):` + label `snapshot-patch` |
| Fewer errors (rule off, option relaxed)                            | `feat(deps):`                         |
| More errors (rule on, option tightened), renamed rule, raised peer | `feat(deps)!:`                        |

- Name the changed rules in the title.
- oxlint-only bumps (`chore(deps-dev):`) release nothing. Keep the title.
- On an nkzw bump, also diff `node_modules/@nkzw/oxlint-config/quality/`. Stricter rule code is `feat(deps)!:`.
- nkzw needs a newer oxlint: merge the oxlint PR first, `@dependabot rebase` the nkzw PR, raise `peerDependencies.oxlint`.
- On an `oxlint-plugin-directive-comments` bump, read the `require-description` diff. Stricter rule code is `feat(deps)!:`.
- Never add `Release-As:`.
- Wrong title already merged: add this to that PR's body and rerun release-please.

  ```
  BEGIN_COMMIT_OVERRIDE
  feat(deps)!: <subject>
  END_COMMIT_OVERRIDE
  ```

<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Built-in Commands vs Scripts

`vp <name>` runs a built-in command. `vp run <name>` runs a `package.json` script or a `vite.config.ts` task. Scripts cannot overwrite built-ins, so `vp dev` and `vp run dev` may do different things. Check `package.json` and `vite.config.ts` first, and run `vp run <name>` when the project defines a script or task with that name.

## Running Scripts

Run TypeScript and JavaScript files with `vpx <file>`, for example `vpx ./scripts/seed.ts --dry-run`. It handles enums, decorators, JSX, and tsconfig `paths`, so do not add `tsx` or `ts-node` to run scripts. `vpx --watch <file>` reruns the file when a file it uses changes, in place of `tsx watch`. `vp node <file>` runs plain Node.js.

## Tool Versions

Run `vp toolchain` to show versions and relationships in the active Vite+
release. Add a tool name to select part of the graph. For example, run
`vp toolchain vite`. Use `--global` to ignore the local `vite-plus` package. Use
`vp why <package>` to show the package-manager dependency graph.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->
