# Instructor Notes — `exercise/ui-10-modernized-no-gha`

This branch is the prepared starting point for the GitHub Actions
exercise. It is intentionally **not** a production rewrite — the
project stays small and teachable.

## Final stack

| Tool                      | Version on this branch        |
|---------------------------|-------------------------------|
| Angular (all packages)    | `~21.2.0`                     |
| `@angular/cli`            | `~21.2.0`                     |
| `@angular-devkit/build-angular` | `~21.2.0`               |
| TypeScript                | `~5.9.0`                      |
| RxJS                      | `~7.8.0`                      |
| zone.js                   | `~0.16.0`                     |
| Node (`engines`, `.nvmrc`)| `^22.12.0` / `22`             |
| npm (`engines`)           | `>=10`                        |
| Cypress                   | `^15.14.0`                    |
| ESLint                    | `^9.0.0`                      |
| `angular-eslint`          | `~21.3.0`                     |
| `typescript-eslint`       | `^8.0.0`                      |
| Karma                     | `~6.4.0`                      |
| Jasmine                   | `~5.13.0`                     |
| `http-server` (cy:ci)     | `^14.1.1`                     |

## What this second pass changed (actual version modernization)

- **Angular 11 → 21.** All `@angular/*` runtime and build packages
  bumped to the `21.2` line. App was migrated to standalone
  bootstrapping (`bootstrapApplication(AppComponent)`), which is
  the default in Angular 19+; `AppModule`, `AppRoutingModule` and
  `@angular/platform-browser-dynamic` were removed. The
  `Component.styleUrls` array form was changed to `styleUrl`.
- **TypeScript 4.1 → 5.9** to satisfy Angular 21’s peer range
  (`>=5.9 <6.0`). `tsconfig.json` retargeted to `ES2022` /
  `module: ES2022` / `moduleResolution: bundler`, with the
  modern strictness flags (`noImplicitOverride`,
  `noPropertyAccessFromIndexSignature`, `isolatedModules`,
  `esModuleInterop`).
- **RxJS 6.6 → 7.8** and **zone.js 0.11 → 0.16**, the versions
  Angular 21 declares as supported peers.
- **Karma + Jasmine 3 → Karma 6.4 + Jasmine 5** with
  `@types/jasmine` 5. The Karma builder’s polyfills are now
  declared inline in `angular.json` (`["zone.js", "zone.js/testing"]`),
  so `src/test.ts` and `src/polyfills.ts` are no longer needed
  and were deleted. The `ChromeHeadlessCI` custom launcher (added
  in the previous cleanup pass) is preserved.
- **ESLint 7 + TSLint → ESLint 9 flat config.** `.eslintrc.json`
  and `.eslintignore` were removed. New `eslint.config.js` uses
  the unified `angular-eslint` package (v21.3) plus
  `typescript-eslint` v8 — replacing the old fan-out of
  `@angular-eslint/*`, `@typescript-eslint/*` and the assorted
  `eslint-plugin-jsdoc / -import / -prefer-arrow` packages.
- **Cypress 7 → 15.** Replaced `cypress.json` with
  `cypress.config.js` (the only supported config since Cypress
  10), moved `cypress/integration/*.spec.js` to
  `cypress/e2e/*.cy.js`, renamed `cypress/support/index.js` to
  `cypress/support/e2e.js`, and removed the legacy
  `cypress/plugins/index.js` (its hooks now live in
  `setupNodeEvents`).
- **Node 14 → 22 LTS.** `.nvmrc` and `package.json#engines` now
  pin Node `22`. Angular 21 declines Node ≤ 20.18 and Node 21/23
  (odd majors).
- **Angular config schema modernized.** `angular.json` switched
  to the new `@angular-devkit/build-angular:application` (esbuild)
  builder for `build`, dropped the deprecated `defaultProject`
  field, dropped the dead `aot: true` option, dropped the unused
  `extract-i18n` target, and used the explicit `outputPath`
  object form (`{ "base": "dist/ci-ui", "browser": "" }`) so the
  build artifact still lives at `dist/ci-ui/` — see “Why the
  Dockerfile stayed unchanged”.
- **Dropped unused `src/environments/`** (the only reference was
  in the old `main.ts`, and modern Angular CLI no longer
  scaffolds environments by default).
- **Added `.dockerignore`** to keep host `node_modules` and other
  noise out of the build context. Without it, `COPY . .` in the
  unchanged Dockerfile would copy host-built native modules into
  the alpine image and break the build non-deterministically.

## What was cleanup vs. what was version modernization

| Pass | Concern |
|------|---------|
| **First pass (cleanup)**     | removed `.travis.yml`, removed dead `tslint.json`, rewrote README, added `INSTRUCTOR_NOTES.md`, fixed broken unit-test assertion, added `ChromeHeadlessCI` launcher, added `.nvmrc`, regenerated lockfile to v3, declared `engines`. |
| **Second pass (this one)**   | actual major-version upgrades of Angular, TypeScript, RxJS, zone.js, Cypress, ESLint, Karma + Jasmine, Node; ESLint flat config migration; Cypress 10+ folder migration; angular.json schema migration; standalone-bootstrap migration. |

## Why the Dockerfile stayed unchanged

The `Dockerfile` on this branch is byte-identical to `main`
(`node:alpine` build stage, `nginx` runtime, `COPY --from=ci-ui
/app/dist/ci-ui /usr/share/nginx/html`). The unpinned tags
intentionally remain a teaching point.

The Angular 21 `application` builder defaults to writing to
`dist/<project>/browser/`, which would have broken nginx’s copy
path. Instead of editing the Dockerfile, `angular.json` now sets
`outputPath: { base: "dist/ci-ui", browser: "" }` so the bundle
lands directly in `dist/ci-ui/` — and the original `COPY` line
keeps working.

`node:alpine` currently resolves to a Node 24/25 alpine image,
which Angular 21 supports (`>=24.0.0`). The build was verified
with `docker build -t ci-ui . && docker run --rm -p 8080:80
ci-ui`.

The `.dockerignore` file is new but is **not** a Dockerfile
change — it is required so that `COPY . .` does not pull host-OS
`node_modules/` (with native modules built for glibc) into an
alpine/musl image.

## What students must still implement themselves in GitHub Actions

The branch deliberately ships **no** `.github/workflows/*`.
A complete student solution should:

1. Trigger on PRs to `main` and on pushes to `main` (and decide
   whether tags also fire a Docker publish).
2. Set up Node 22 (consume `.nvmrc`) and cache the npm cache.
3. Install with `npm ci`.
4. Run `npm run lint` as its own job.
5. Run `npm run test:ci` (single-shot headless Karma) as its own
   job.
6. Run `npm run build:prod` and either upload `dist/ci-ui` as an
   artifact or feed it into the Cypress and Docker jobs.
7. Run `npm run cy:ci` for end-to-end coverage. Decide whether
   Cypress runs in a container image or via the
   `cypress-io/github-action`.
8. Build the Docker image (`docker build -t ci-ui .`) and decide
   what to do with it — at minimum verify the build succeeds;
   optionally push to a registry on tagged commits using
   repository secrets.
9. Decide job ordering and concurrency. Lint and unit tests can
   fan out in parallel; Cypress and Docker build typically depend
   on a successful build step.

## Commands that should succeed locally on this branch

After `npm ci`:

- `npm run lint`
- `npm test` (interactive) and `npm run test:ci` (headless)
- `npm run build:prod`
- `npm run cy:open` (interactive) and `npm run cy:ci` (headless)
- `docker build -t ci-ui .`

All five were verified to pass before this commit lands.

## What is still intentionally left for students

- **No GitHub Actions workflows.** The whole point.
- **`Dockerfile` is unchanged from `main`** — `node:alpine` and
  `nginx` are unpinned. Pinning is a worthwhile teaching
  conversation rather than something this branch should
  pre-solve.
- **No automated Docker push, no release flow, no DockerHub
  credentials wiring.** Students decide which jobs publish
  artifacts and how secrets are scoped.
- **No coverage thresholds, no commit hooks, no Renovate /
  Dependabot configuration.** Out of scope; instructors can
  layer these in later modules.
