---
name: GraphQL Schema Sync
description: Validates GraphQL schema consistency and resolver completeness
keywords: graphql, schema, validation, resolvers
---

# GraphQL Schema Sync Skill

When this skill is activated, perform the following validation:

1. **Schema Validation**: Read `src/app/api/graphql/typeDefs.ts` and validate the GraphQL schema syntax and structure for any inconsistencies or errors

2. **Resolver Completeness**: Check `src/app/api/graphql/resolvers.ts` to ensure all queries and mutations defined in the schema have corresponding resolver implementations

3. **Report Findings**: Provide a concise summary of any missing resolvers, schema errors, or structural issues with actionable recommendations
