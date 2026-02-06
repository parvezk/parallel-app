# Parallel App

This next.js app fetches data using URQL (GraphQL client and front end data layer) and performs CRUD operation on Turso DB using GraphQL API and Drizzle ORM (back-end data layer)

## Tech Stack

Client (Browser) <-> Next.js App <-> URQL Client <-> GraphQL API <-> Drizzle ORM <-> TursoDB/SQLite

- **Frontend**: Next.js
- **API Layer**: GraphQL
- **Data Fetching**: URQL Client
- **Database**: TursoDB/SQLite
- **ORM**: Drizzle
- **Language**: TypeScript

## Project Structure

Key components and their roles:

### Frontend Layer

- `src/app/page.tsx`: Main page component for UI rendering
- `src/lib/urqlClient.ts`: URQL client configuration for GraphQL operations

### API Layer

- `src/app/api/graphql/route.ts`: GraphQL API endpoint handler

### Schema Layer

- `src/lib/schema.ts`: GraphQL schema definitions and resolvers

### Database Layer

- `src/lib/db.ts`: Database configuration and Drizzle ORM setup

## Data Flow

1. User interaction in UI (page.tsx)
2. URQL client sends GraphQL request
3. GraphQL route processes request
4. Schema handles operation
5. Drizzle ORM executes database queries
6. Data returns through the same path

## Key Features

- Type-safe end-to-end development with TypeScript
- Modern data fetching with GraphQL
- Efficient database access via Drizzle ORM
- Server-side rendering with Next.js
- Built-in API routing
- Efficient caching with URQL

## Getting Started

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## GraphQL Playground (Apollo Sandbox)

Test your GraphQL API interactively:

1. Start the dev server: `npm run dev`
2. Open [Apollo Sandbox](https://studio.apollographql.com/sandbox)
3. Set endpoint to `http://localhost:3000/api/graphql`
4. Add auth header: Click the **gear icon** → **Shared headers** → Add `Authorization` with value `Bearer <your-jwt-token>`
5. Run queries

## Database (Drizzle + TursoDB)

```bash
# Open Drizzle Studio (visual DB browser)
npm run db:studio

# Push schema changes directly to DB (dev only)
npm run db:push

# Generate migration files from schema changes
npm run db:generate

# Apply migrations
npm run db:migrate
```

## Environment Variables

Create `.env.local`:

```bash
TURSO_CONNECTION_URL="libsql://..."
TURSO_AUTH_TOKEN="..."
```

## Deployment

Hosted on **AWS Amplify** with Git-based deployments.

See `amplify.yml` for build configuration.

## More Info

- **Development guide**: `agents.md`
- **Architecture & commands**: `CLAUDE.md`
