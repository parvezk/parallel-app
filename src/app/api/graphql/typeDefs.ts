/**
 * Type definitions for GraphQL Schema (Data Model) ./src/gql
 */
const schema = `#graphql

type User {
  id: String!
  email: String!
  createdAt: String!
  token: String
  issues: [Issue]!
}

input AuthInput {
  email: String!
  password: String!
}

enum IssueStatus {
  BACKLOG
  TODO
  IN_PROGRESS
  DONE
}

scalar ID

type Issue {
  id: String!
  title: String!
  userId: String!
  content: String!
  status: IssueStatus!
  createdAt: String!
}

input CreateIssueInput {
  title: String!
  content: String!
  status: IssueStatus!
}

type Query {
  user: User!
  issues: [Issue!]!
  issuesForUser(email: String!): [Issue!]!
}

type Mutation {
  updateIssueStatus(id: String!, status: IssueStatus!): Issue!
  createIssue(input: CreateIssueInput!): Issue!
  deleteIssue(id: ID!): Issue!
  createUser(input: AuthInput!): User
  signin(input: AuthInput!): User
}
`;

export default schema;
