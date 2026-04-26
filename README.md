# ci-ui

A small Angular 11 application used as the subject of a CI/CD
teaching exercise. The app itself just renders `Hello Docker world!`
— the interesting part is the surrounding lint, test, e2e and
Docker tooling.

## Requirements

- Node 14 (see `.nvmrc`)
- npm 6+
- Chrome (for unit tests via Karma and for `cypress open`)
- Docker (for the container build)

## Install

```bash
npm ci
```

## Run the dev server

```bash
npm start
```

Navigate to <http://localhost:4200/>. The app reloads when source
files change.

## Lint

```bash
npm run lint
```

Linting is wired through ESLint (`@angular-eslint`).

## Unit tests

Interactive (watch mode in a real Chrome window):

```bash
npm test
```

Single-run, headless — suitable for CI:

```bash
npm run test:ci
```

## End-to-end tests (Cypress)

Interactive runner:

```bash
npm run cy:open
```

Headless run against a production build served on
`localhost:4200`:

```bash
npm run cy:ci
```

## Production build

```bash
npm run build:prod
```

Build output lands in `dist/ci-ui`.

## Docker

The `Dockerfile` is a two-stage build: stage 1 builds the Angular
app with Node 14, stage 2 serves the static bundle from nginx.

```bash
docker build -t ci-ui .
docker run --rm -p 8080:80 ci-ui
```

Then open <http://localhost:8080/>.

## Continuous integration

This branch intentionally **does not ship a CI workflow**. Wiring
the lint / unit test / build / Cypress / Docker steps into GitHub
Actions is the exercise — see `INSTRUCTOR_NOTES.md` for scope.
