# Instructor Notes — `exercise/ui-10-modernized-no-gha`

This branch is the prepared starting point for the GitHub Actions
exercise. It is intentionally **not** a production rewrite — the
project stays small and teachable.

## What was modernized

- **Removed `.travis.yml`.** Travis is no longer the target CI;
  leaving the file in place would mislead students about which
  pipeline they are supposed to author.
- **Removed `tslint.json`.** Linting already runs through ESLint
  (`@angular-eslint`); `tslint` was dead config and a dead
  dev-dependency.
- **Pinned Docker base images.** `Dockerfile` now uses
  `node:14-alpine` (matches the supported Node range for Angular
  11) and `nginx:1.25-alpine`, so `docker build` is reproducible
  rather than drifting with the `latest` tag.
- **Replaced the deprecated `--prod` flag** with
  `--configuration production` in `Dockerfile` and in the
  `cy:ci` script. Added a `build:prod` alias so downstream
  scripts (and student CI jobs) have a stable entry point.
- **Added a `test:ci` script and a `ChromeHeadlessCI` Karma
  launcher** (`--no-sandbox --disable-gpu`) so unit tests can run
  single-shot in a container without a display.
- **Removed the dead Protractor `e2e` target** from
  `angular.json`. There is no `e2e/` folder; Cypress is the real
  e2e tool. Keeping the target meant `ng e2e` failed in confusing
  ways.
- **Regenerated `package-lock.json` at lockfile v3** so `npm ci`
  is reproducible on modern npm.
- **Pinned the Node version** with `.nvmrc` (14) and an `engines`
  range in `package.json`.
- **Fixed the broken unit test.** `app.component.spec.ts` asserted
  on markup that no longer exists in `app.component.html`, so
  `npm test` failed on every fresh checkout. The spec now matches
  the rendered "Hello Docker world!" content.
- **Rewrote the README** to describe the real local workflow
  (Cypress, Karma headless, Docker, Angular 11) instead of the
  Angular CLI boilerplate and the obsolete Protractor mention.

## What was intentionally left for students

- **No `.github/workflows/*` exists, by design.** Authoring the
  pipeline is the whole point of the exercise.
- **No automated Docker push, no release flow, no DockerHub
  credentials wiring.** Students decide which jobs publish
  artifacts and how secrets are scoped.
- **Angular 11, Node 14, Cypress 7 are kept as-is.** This is a
  CI/CD exercise, not a framework migration. Bumping major
  versions would expand scope and obscure the CI work.
- **The original `e2e` Protractor folder is not reintroduced.**
  Students should treat Cypress as the e2e tool.
- **No coverage thresholds, no commit hooks, no Renovate/Dependabot
  configuration.** Out of scope; instructors can layer these in
  later modules.

## What students must implement themselves in GitHub Actions

A complete solution for the exercise should:

1. **Trigger on pull requests** to `main` and on pushes to `main`
   (and decide whether to also run on tags for the Docker
   publish job).
2. **Set up Node 14** (consume `.nvmrc`) and cache the npm cache.
3. **Install with `npm ci`** rather than `npm install`.
4. **Run `npm run lint`** as its own job.
5. **Run `npm run test:ci`** as its own job (headless Karma,
   single shot).
6. **Run `npm run build:prod`** and either upload `dist/ci-ui`
   as an artifact or feed it into the Cypress and Docker jobs.
7. **Run `npm run cy:ci`** for end-to-end coverage. Decide
   whether Cypress runs in a container image or via the
   `cypress-io/github-action`.
8. **Build the Docker image** (`docker build -t ci-ui .`) and
   decide what to do with it — at minimum verify the build
   succeeds; optionally push to a registry on tagged commits
   using repository secrets.
9. **Decide job ordering and concurrency.** Lint and unit tests
   can fan out in parallel; Cypress and Docker build typically
   depend on a successful build step.

## Commands that should succeed locally on this branch

After `npm ci`:

- `npm run lint`
- `npm test` (interactive) and `npm run test:ci` (headless)
- `npm run build:prod`
- `npm run cy:open` (manual) and `npm run cy:ci` (headless)
- `docker build -t ci-ui .`

If any of these fail on a clean checkout, that is a bug in this
branch, not part of the exercise.
