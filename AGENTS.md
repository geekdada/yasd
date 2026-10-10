# AGENTS.md

## Project overview

- Surge Web Dashboard (formerly YASD) is a React 19 single-page app for controlling Surge instances through the Surge HTTP API.
- The app authenticates against a selected Surge host, then sends API traffic to that host's `/v1` endpoints.
- Remembered profiles and language/theme preferences are stored locally in the browser.

## Tooling and environment

- Node `24` is the expected runtime (`.node-version` is `24`, `package.json` requires `>=24 <25`).
- Package manager: `pnpm` (`packageManager: pnpm@12.11.2`).
- Vite Plus (`vp`) powers the dev server, linting, formatting, and tests.
- Path alias: `@/*` maps to `src/*`.
- TypeScript is strict and uses Emotion's JSX runtime (`jsxImportSource: @emotion/react`).

## Common commands

```bash
pnpm start                     # dev server
pnpm start:profile             # dev server with profiling enabled
pnpm lint                      # type-aware lint
pnpm lint:fix                  # auto-fix lint issues
pnpm test:types                # TypeScript typecheck
pnpm test                      # run Vitest once
pnpm test -- src/path/to.spec.ts
pnpm test:watch                # watch mode
pnpm test:coverage             # coverage report
pnpm verify-translation        # ensure zh keys match en baseline
pnpm build                     # Vercel-style production build with service worker
pnpm build:release             # CI release build + tarball bundle
pnpm build:surge               # Surge built-in bundle under /web
```

## Architecture

### App shell and routing

- `src/index.tsx` is the browser entrypoint: it loads global styles, initializes i18n, renders the router, and conditionally registers the service worker.
- `src/router/router.tsx` wraps the route tree with `AppContainer` and `App`, then creates either a browser router or hash router based on `VITE_HASH_ROUTER`.
- `src/routes.tsx` is the route map. Most feature pages are lazy-loaded; `routeOptions` control fullscreen pages and safe-area behavior.
- `AppContainer` wires Redux, Helmet, theme state, UI confirmation dialogs, safe-area support, and bootstrap-time initialization.
- `App.tsx` owns app-level SWR config, the page layout shell, traffic polling hookup, network failure modal, and version update checks.

### State and data flow

- Redux in `src/store` is intentionally small:
  - `history`: remembered Surge profiles from local storage
  - `profile`: the currently selected Surge target
  - `traffic`: rolling traffic stats used by the dashboard charts
- `profileActions.update` is the key handoff point: it calls `setServer(...)` in `src/utils/fetcher.ts`, which reconfigures the shared Axios client with the selected host, port, TLS mode, and `x-key` header.
- Most server reads use SWR on top of that shared Axios client (`src/utils/fetcher.ts`, `src/data/api.ts`, plus page-local hooks).
- `src/bootstrap/Bootstrap.tsx` restores remembered profile history and last-used language before rendering the app.

### Feature layout

- `src/pages/*` contains route-level screens: Landing, Home, Policies, Requests, Traffic, Modules, Scripting, DNS, Devices, and Profiles.
- `src/components/*` contains shared UI, providers, and cross-page building blocks.
- `src/components/ui/*` holds shadcn/ui-style primitives.
- `src/types/index.ts` is the central place for API response and domain types.

### Styling and UI stack

- The codebase uses a hybrid styling approach:
  - Tailwind CSS v4 + shadcn tokens in `src/styles/shadcn.css`
  - global CSS in `src/styles/global.css`
  - Emotion `css`/`styled` in many page and shared components
- When editing UI, match the surrounding style instead of forcing a single styling system.

### i18n

- i18n lives under `src/i18n` and lazy-loads locale JSON files.
- English (`src/i18n/en/translation.json`) is the baseline; `scripts/verify-translations.mjs` checks that `zh` contains every key from `en`.
- If you add or rename translation keys, run `pnpm verify-translation`.

### Build and runtime modes

- `scripts/build.mjs` drives release builds and post-processing.
- Important env toggles used by the app/build:
  - `VITE_HASH_ROUTER`
  - `VITE_RUN_IN_SURGE`
  - `VITE_URL_PATH_PREFIX`
  - `VITE_USE_SW`
  - `VITE_PROFILE`
  - local-dev connection helpers: `VITE_PROTOCOL`, `VITE_HOST`, `VITE_PORT`
- `pnpm build` targets the standalone/Vercel deployment flow.
- `pnpm build:release` and `pnpm build:surge` switch to hash-routing and bundle artifacts for release distribution.

## CI and commit conventions

- GitHub Actions runs on Node 24 and currently executes `pnpm build`, `pnpm verify-translation`, and `pnpm test`.
- Commit messages follow Angular-style commitlint rules with a 72-character header limit.

<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, but it invokes Vite through `vp dev` and `vp build`.

## Vite+ Workflow

`vp` is a global binary that handles the full development lifecycle. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

### Start

- create - Create a new project from a template
- migrate - Migrate an existing project to Vite+
- config - Configure hooks and agent integration
- staged - Run linters on staged files
- install (`i`) - Install dependencies
- env - Manage Node.js versions

### Develop

- dev - Run the development server
- check - Run format, lint, and TypeScript type checks
- lint - Lint code
- fmt - Format code
- test - Run tests

### Execute

- run - Run monorepo tasks
- exec - Execute a command from local `node_modules/.bin`
- dlx - Execute a package binary without installing it as a dependency
- cache - Manage the task cache

### Build

- build - Build for production
- pack - Build libraries
- preview - Preview production build

### Manage Dependencies

Vite+ automatically detects and wraps the underlying package manager such as pnpm, npm, or Yarn through the `packageManager` field in `package.json` or package manager-specific lockfiles.

- add - Add packages to dependencies
- remove (`rm`, `un`, `uninstall`) - Remove packages from dependencies
- update (`up`) - Update packages to latest versions
- dedupe - Deduplicate dependencies
- outdated - Check for outdated packages
- list (`ls`) - List installed packages
- why (`explain`) - Show why a package is installed
- info (`view`, `show`) - View package information from the registry
- link (`ln`) / unlink - Manage local package links
- pm - Forward a command to the package manager

### Maintain

- upgrade - Update `vp` itself to the latest version

These commands map to their corresponding tools. For example, `vp dev --port 3000` runs Vite's dev server and works the same as Vite. `vp test` runs JavaScript tests through the bundled Vitest. The version of all tools can be checked using `vp --version`. This is useful when researching documentation, features, and bugs.

## Common Pitfalls

- **Using the package manager directly:** Do not use pnpm, npm, or Yarn directly. Vite+ can handle all package manager operations.
- **Always use Vite commands to run tools:** Don't attempt to run `vp vitest` or `vp oxlint`. They do not exist. Use `vp test` and `vp lint` instead.
- **Running scripts:** Vite+ commands take precedence over `package.json` scripts. If there is a `test` script defined in `scripts` that conflicts with the built-in `vp test` command, run it using `vp run test`.
- **Do not install Vitest, Oxlint, Oxfmt, or tsdown directly:** Vite+ wraps these tools. They must not be installed directly. You cannot upgrade these tools by installing their latest versions. Always use Vite+ commands.
- **Use Vite+ wrappers for one-off binaries:** Use `vp dlx` instead of package-manager-specific `dlx`/`npx` commands.
- **Import JavaScript modules from `vite-plus`:** Instead of importing from `vite` or `vitest`, all modules should be imported from the project's `vite-plus` dependency. For example, `import { defineConfig } from 'vite-plus';` or `import { expect, test, vi } from 'vite-plus/test';`. You must not install `vitest` to import test utilities.
- **Type-Aware Linting:** There is no need to install `oxlint-tsgolint`, `vp lint --type-aware` works out of the box.

## Review Checklist for Agents

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to validate changes.
<!--VITE PLUS END-->
