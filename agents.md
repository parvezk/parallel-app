## agents.md

This file documents how to work on this repo (for humans and coding agents): dev setup, coding conventions, testing, and PR expectations.

## Dev environment setup

### Prereqs

- Node.js **20+** (recommended)
- npm (comes with Node)

### Install

```bash
npm ci
```

### Environment variables

Create `.env.local` (or `.env`) in the repo root:

```bash
# Required for DB access (Turso / libsql)
TURSO_CONNECTION_URL="libsql://..."
TURSO_AUTH_TOKEN="..."

# Optional (defaults to /api/graphql in next.config.ts)
NEXT_PUBLIC_GRAPHQL_API_URL="/api/graphql"
```

Notes:

- The database client is configured in `src/db/db.ts`.
- Auth currently uses a hard-coded JWT secret in `src/utils/auth.ts` (`SECRET = "use_an_ENV_VAR"`). For production, move this to an environment variable.

### Run the app

```bash
npm run dev
```

App: `http://localhost:3000`

## Common commands

```bash
# Lint (Next.js ESLint)
npm run lint
npm run lint:fix

# Tests (Jest + React Testing Library)
npm test
npm run test:watch
npm run test:coverage

# Database / migrations (Drizzle Kit)
npm run db:generate
npm run db:migrate
npm run db:studio
```

## Coding style & conventions

### General

- **Language**: TypeScript, React (Next.js App Router).
- **Imports**: prefer `@/` path aliases (see `tsconfig.json`).
- **Unused code**: keep imports/vars clean; ESLint uses `eslint-plugin-unused-imports`.

### Project structure

- **UI routes/layouts**: `src/app/(auth)` and `src/app/(dashboard)`
- **Components**: `src/app/components/*` (tests co-located as `*.test.tsx`)
- **GraphQL API**: `src/app/api/graphql/*` (`route.ts`, `typeDefs.ts`, `resolvers.ts`)
- **DB layer**: `src/db/*` (`db.ts`, `schema.ts`)
- **GraphQL documents (client)**: `src/gql/*`

### GraphQL/API standards

Follow the repo’s GraphQL conventions in `.kiro/steering/api-standard.md`, especially:

- Use `GraphQLError` for API errors (auth, db, validation) with meaningful `extensions.code`
- Enforce auth via `context.user` checks for protected resolvers
- Keep resolvers small and single-purpose

## Testing guidelines

- Run `npm test` before opening a PR.
- Prefer adding/updating co-located component tests in `src/app/components/*.test.tsx`.
- Keep tests deterministic; avoid hitting real external services.

## PR instructions

### Before you open a PR

- Ensure **lint passes**: `npm run lint` (or `npm run lint:fix`)
- Ensure **tests pass**: `npm test`
- Keep changes focused and small; update/add tests when behavior changes

### Branch / commit hygiene

- Branch names: short and descriptive (e.g. `fix-auth-token`, `docs-agents-md`)
- Commit messages: follow existing style (mix of conventional + descriptive is OK; see `git log`)

### PR description checklist

- **Summary**: what changed and why
- **Test plan**: exact commands run and key scenarios checked
- **Screenshots**: for UI changes

