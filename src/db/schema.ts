import { randomUUID } from "crypto";
import { relations, sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
/**
 * Defines the GraphQL schema (Data Model), including queries, and mutations.
 * Contains type definitions and resolvers
 * Maps GraphQL operations to database operations
 * @returns
 */

export enum IssueStatus {
  BACKLOG = "BACKLOG",
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

const id = () =>
  text("id")
    .primaryKey()
    .$default(() => randomUUID());

const createdAt = () =>
  text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull();

const editedAt = () => text("edited_at").default(sql`CURRENT_TIMESTAMP`);

export const users = sqliteTable("users", {
  id: id(),
  createdAt: createdAt(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
});

export const userRelations = relations(users, ({ many }) => ({
  issues: many(issues),
}));

export const issues = sqliteTable("issues", {
  id: id(),
  title: text("title").notNull(),
  userId: text("userId").notNull(),
  content: text("content").notNull(),
  status: text("status").default(IssueStatus.BACKLOG).notNull(),
  createdAt: createdAt(),
  editedAt: editedAt(),
});

export const issueRelations = relations(issues, ({ one }) => ({
  user: one(users, {
    fields: [issues.userId],
    references: [users.id],
  }),
}));

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;

export type InsertIssues = typeof issues.$inferInsert;
export type SelectIssues = typeof issues.$inferSelect;
