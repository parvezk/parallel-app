Here is an overview of the **Parallel App** codebase and the main architectural patterns it utilizes.

### 🧩 Tech Stack
The project is a modern, full-stack Next.js application designed with type safety and efficient data fetching in mind. The core stack includes:

- **Frontend Framework**: Next.js 15 (App Router) + React 19
- **UI Library**: NextUI (`@nextui-org/react`)
- **API Layer**: GraphQL
- **Client Data Fetching**: URQL Client (`@urql/next`)
- **Database**: Turso (Serverless SQLite)
- **ORM**: Drizzle ORM
- **Language**: TypeScript

---

### 🏗️ Main Architecture Patterns

#### 1. Next.js App Router with Route Groups
The frontend is built on the Next.js App Router, heavily utilizing route groups to organize the layout without affecting the URL structure:
- `src/app/(auth)`: Handles authentication-related pages (login, signup).
- `src/app/(dashboard)`: Contains the main application interface for authenticated users.
Components are grouped in `src/app/components/` with co-located testing files (`*.test.tsx`) to keep behavior and tests closely coupled.

#### 2. GraphQL-First API Layer
Instead of standard REST endpoints, the backend exposes a single API endpoint located at `src/app/api/graphql/route.ts`. 
- **Type Definitions & Resolvers**: The schema rules and resolvers map precisely to the operations allowed by the client and are handled in `typeDefs.ts` and `resolvers.ts`.
- **Standardized Error Handling**: The application relies on returning specific `GraphQLError` objects (with meaningful `extensions.code`) for scenarios such as validation or database constraints.

#### 3. Client-Side Data Management (URQL)
On the browser side, the application relies on **URQL** as its GraphQL client. It replaces traditional data-fetching methods (like raw `fetch` or Axios) to provide powerful request caching, state management, and declarative data fetching queries out of the box.

#### 4. Type-Safe Database ORM (Drizzle + Turso)
The data persistence layer is handled via an edge-ready Turso database powered by SQLite. 
- **Drizzle ORM** guarantees type-safe database queries.
- The entire database domain is defined inside `src/db/schema.ts` (e.g., `users` and `issues` tables with standard one-to-many relationship mapping).
- Database migrations are scripted and versioned via standard Drizzle Kit commands (`npm run db:generate`, `npm run db:migrate`). 

#### 5. JWT-Based Authentication via GraphQL Context
Authentication utilizes JWTs. When users make requests, the application validates the JWT and injects the user's data into the GraphQL context (`context.user`). This enforces a standardized and protected request lifecycle where sensitive GraphQL resolvers check the `context` to authorize operations, ensuring resolvers remain small, secure, and single-purpose.

#### 6. Continuous Deployment
The repository is primed for Git-based deployments on **AWS Amplify**, with explicit build specifications housed in `amplify.yml`. Pushes to the `main` branch trigger automated staging/production build pipelines.
