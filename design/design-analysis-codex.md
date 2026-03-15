# Codebase Design Analysis

This repo is a small issue tracker built as a layered Next.js app. The main app lives under `src/`, and there is a separate Docusaurus docs site under `docs/`.

The main runtime path is:

Browser UI -> URQL client -> Next.js route handler at `/api/graphql` -> GraphQL resolvers -> Drizzle ORM -> Turso/SQLite

You can see that flow in [src/app/gqlProvider.tsx](../src/app/gqlProvider.tsx), [src/app/api/graphql/route.ts](../src/app/api/graphql/route.ts), [src/app/api/graphql/resolvers.ts](../src/app/api/graphql/resolvers.ts), and [src/db/db.ts](../src/db/db.ts).

## High-level structure

The UI uses the Next.js App Router with route groups for authenticated and unauthenticated sections:

- `src/app/(dashboard)`
- `src/app/(auth)`

The root layout is client-side and delays rendering until mount, then wraps the app with a provider stack for GraphQL and user state in [src/app/layout.tsx](../src/app/layout.tsx) and [src/app/providers.tsx](../src/app/providers.tsx).

The dashboard page is thin: it runs a query and renders child components like `Issue` and `CreateIssue`. That is a standard "container page plus presentational components" split. See [src/app/(dashboard)/page.tsx](../src/app/(dashboard)/page.tsx), [src/app/components/Issue.tsx](../src/app/components/Issue.tsx), and [src/app/components/CreateIssue.tsx](../src/app/components/CreateIssue.tsx).

## Main architecture patterns

### 1. Layered architecture

The codebase is separated into clear layers:

- UI and route composition in `src/app`
- Client GraphQL documents in `src/gql`
- API schema and resolvers in `src/app/api/graphql`
- Persistence in `src/db`
- Auth and token helpers in `src/utils`

This keeps transport, business logic, and persistence concerns reasonably isolated.

### 2. Provider pattern for app-wide concerns

Global concerns are injected once near the root:

- URQL client provider in [src/app/gqlProvider.tsx](../src/app/gqlProvider.tsx)
- User/theme context provider in [src/app/context/UserContext.tsx](../src/app/context/UserContext.tsx)

This is the main cross-cutting state mechanism in the frontend.

### 3. Schema-first GraphQL API

The API follows a schema-first GraphQL pattern:

- Schema SDL lives in [src/app/api/graphql/typeDefs.ts](../src/app/api/graphql/typeDefs.ts)
- Resolver implementation lives in [src/app/api/graphql/resolvers.ts](../src/app/api/graphql/resolvers.ts)
- The route handler compiles the schema and executes incoming operations in [src/app/api/graphql/route.ts](../src/app/api/graphql/route.ts)

Resolvers are thin and mostly translate GraphQL operations into Drizzle queries.

### 4. ORM-backed domain model

The data model is declared once in Drizzle:

- Users and issues tables in [src/db/schema.ts](../src/db/schema.ts)
- Database client wiring in [src/db/db.ts](../src/db/db.ts)
- Migrations configured via [drizzle.config.ts](../drizzle.config.ts) and [migrate.ts](../migrate.ts)

The repo also reuses domain values such as `IssueStatus` across client and server, which is a lightweight shared-domain-model pattern.

### 5. Context-plus-token authentication

Authentication is handled with JWTs stored in browser local storage and resolved into GraphQL context on the server:

- Token storage helpers in [src/utils/token.ts](../src/utils/token.ts)
- JWT creation and lookup in [src/utils/auth.ts](../src/utils/auth.ts)
- Request context creation in [src/app/api/graphql/route.ts](../src/app/api/graphql/route.ts)

Protected resolvers then check `context.user` before executing.

### 6. Route-group and layout composition

The app uses App Router layouts as structural shells:

- `src/app/(auth)/layout.tsx` for sign-in/sign-up pages
- `src/app/(dashboard)/layout.tsx` for the main app shell with sidebar and top bar

This is the main composition boundary for the UI.

## What this means in practice

Architecturally, this app behaves more like a client-driven SPA hosted inside Next.js than a server-component-heavy Next.js application.

Most pages are marked `"use client"`, data fetching happens in the browser through URQL, and Next.js is acting mainly as:

- the application shell
- the router
- the host for the internal GraphQL API

The `/api/graphql` route effectively functions as a small backend-for-frontend layer.

## Supporting patterns

- Co-located UI tests with Jest and React Testing Library, configured in [jest.config.js](../jest.config.js)
- Centralized GraphQL document definitions in `src/gql`
- Drizzle schema-as-code with generated SQL migrations in `migrations/`
- API-wide CORS handling in [middleware.ts](../middleware.ts)
- Shared path aliases from [tsconfig.json](../tsconfig.json)

## Architectural strengths

- Clear separation between frontend, API, and persistence
- Small and easy-to-follow GraphQL resolvers
- Single internal API surface for frontend data access
- Shared TypeScript code and enums across layers
- Route groups make the auth/dashboard split obvious

## Notable tradeoffs

- The app is heavily client-rendered, so it is not taking much advantage of React Server Components or server-first App Router patterns
- Auth state is driven by local storage rather than cookies/session middleware
- The root layout intentionally waits for client mount before rendering providers, which avoids some hydration issues but also means the app does not render as a normal server-first layout
- The GraphQL route compiles the executable schema in-process and acts as a lightweight monolith rather than a separately deployed backend

## Summary

This codebase uses a pragmatic full-stack pattern:

- Next.js for UI shell and routing
- URQL for browser-side GraphQL data access
- a local GraphQL BFF layer inside the app
- Drizzle ORM for database access to Turso/SQLite
- simple JWT-based auth carried through GraphQL context

The overall design is straightforward, easy to trace, and well-suited to a small product, with most of the architectural complexity concentrated in the GraphQL boundary.
