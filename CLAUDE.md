# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev              # Start development server (Next.js)

# Build & Production
npm run build            # Build for production
npm start                # Start production server

# Testing
npm test                 # Run all tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage report

# Linting
npm run lint             # Run ESLint
npm run lint:fix         # Auto-fix linting issues

# Database (Drizzle + TursoDB)
npm run db:generate      # Generate migrations from schema changes
npm run db:migrate       # Apply migrations
npm run db:studio        # Open Drizzle Studio
```

## Pre-commit Hook

Husky runs `npm run lint:fix` and `npm test` before each commit. All tests must pass and lint issues must be auto-fixed before committing.

## Architecture

This is a Next.js 15 issue tracking app with a GraphQL API layer.

### Data Flow
```
Browser → URQL Client → GraphQL API (Next.js route) → Drizzle ORM → TursoDB/SQLite
```

### Key Layers

**Frontend (React 19 + Next.js)**
- `src/app/gqlProvider.tsx` - URQL client setup, adds auth token to requests
- `src/app/(dashboard)/` - Protected dashboard routes (issues list, projects, settings)
- `src/app/(auth)/` - Auth routes (signin, signup)
- `src/app/components/` - UI components (Issue, CreateIssue, Sidebar, TopBar)

**GraphQL API**
- `src/app/api/graphql/route.ts` - POST handler, creates schema, extracts user from JWT
- `src/app/api/graphql/resolvers.ts` - Query/Mutation implementations
- `src/app/api/graphql/typeDefs.ts` - GraphQL schema (User, Issue, IssueStatus enum)

**Database (Drizzle ORM)**
- `src/db/db.ts` - libsql client connection to TursoDB
- `src/db/schema.ts` - Table definitions (users, issues) with relations
- `drizzle.config.ts` - Migration config pointing to `./migrations`

**GraphQL Operations (client-side)**
- `src/gql/` - Query and mutation definitions used by URQL

### Path Aliases (tsconfig.json)
- `@/*` → `./src/*`
- `@/components/*` → `src/app/components/*`
- `@/gql/*` → `src/gql/*`
- `@/db/*` or `@/lib/*` → `src/db/*`

### Authentication
- JWT-based auth in `src/utils/auth.ts`
- Token stored client-side, accessed via `src/utils/token.ts`
- Protected routes check auth in dashboard layout's `useEffect`
- GraphQL resolvers check `context.user` for authorization

### Issue Status Workflow
```typescript
enum IssueStatus { BACKLOG, TODO, IN_PROGRESS, DONE }
```

## Deployment

Hosted on **AWS Amplify** with Git-based deployments (auto-deploys on push to `main`).

- Build config: `amplify.yml`
- IAM roles and env vars are configured in the Amplify Console (not in repo)

## Testing

Tests use Jest + React Testing Library. Test files live next to components: `*.test.tsx`.

Coverage excludes: `src/lib/`, `src/gql/`, `src/db/`, `src/utils/`

Run a single test file:
```bash
npm test -- path/to/file.test.tsx
```
