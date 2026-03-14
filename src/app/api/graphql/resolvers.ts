import { db } from "@/db/db";
import { eq, desc, and } from "drizzle-orm";
import { users, issues, IssueStatus } from "@/db/schema";
import { GraphQLError } from "graphql";
import { signin, signup } from "@/utils/auth";
import { GQLContext } from "@/types/GQLContext";
/**
 * API Routes: Process incoming GraphQL queries/mutations requests
 * Interact with the SQLite Turso DB using Drizzle ORM
 */

const resolvers = {
  Query: {
    issues: async (_parent, _args, context: GQLContext) => {
      const user = await context.getUser();
      if (!user)
        throw new GraphQLError("ISSUES UNAUTHORIZED", {
          extensions: { code: 401 },
        });

      try {
        return await db
          .select()
          .from(issues)
          .where(eq(issues.userId, user.id as string))
          .orderBy(desc(issues.createdAt));
      } catch (err) {
        console.error("Failed to fetch issues:", err);
        throw new GraphQLError("Failed to fetch issues", {
          extensions: { code: "DB_ERROR" },
        });
      }
    },

    user: async (_parent, _args, context: GQLContext) => {
      const currentUser = await context.getUser();
      if (!currentUser)
        throw new GraphQLError("UNAUTHORIZED", {
          extensions: { code: 401 },
        });

      const user = await db.query.users.findFirst({
        where: eq(users.id, currentUser.id as string),
      });

      if (!user)
        throw new GraphQLError("User not found", {
          extensions: { code: "NOT_FOUND" },
        });

      return user;
    },
  },

  Mutation: {
    createIssue: async (_parent, { input }, context: GQLContext) => {
      const user = await context.getUser();
      if (!user)
        throw new GraphQLError("UNAUTHORIZED", { extensions: { code: 401 } });

      const issueData = {
        ...input,
        userId: user.id as string,
        status: input.status || IssueStatus.BACKLOG,
      };

      const [newIssue] = await db.insert(issues).values(issueData).returning();
      if (!newIssue)
        throw new GraphQLError("CUSTOM Failed to create issue", {
          extensions: { code: "CREATE_ERROR" },
        });
      console.log("issue created", newIssue);
      return newIssue;
    },

    updateIssueStatus: async (_parent, { id, status }, context: GQLContext) => {
      const user = await context.getUser();
      if (!user)
        throw new GraphQLError("UNAUTHORIZED", { extensions: { code: 401 } });
      const [updatedIssue] = await db
        .update(issues)
        .set({ [issues.status.name]: status })
        .where(and(eq(issues.id, id), eq(issues.userId, context.user.id)))
        .returning();

      if (!updatedIssue)
        throw new GraphQLError("Failed to update issue status", {
          extensions: { code: "UPDATE_ERROR" },
        });
      return updatedIssue;
    },

    deleteIssue: async (_parent, { id }, context: GQLContext) => {
      const user = await context.getUser();
      if (!user)
        throw new GraphQLError("UNAUTHORIZED", { extensions: { code: 401 } });

      const [deletedIssue] = await db
        .delete(issues)
        .where(and(eq(issues.id, id), eq(issues.userId, context.user.id)))
        .returning();

      if (!deletedIssue)
        throw new GraphQLError("Failed to delete issue", {
          extensions: { code: "DELETE_ERROR" },
        });
      return deletedIssue;
    },

    createUser: async (_parent, args) => {
      const data = await signup(args.input);

      if (!data || !data.user || !data.token) {
        throw new GraphQLError("could not create user", {
          extensions: { code: "AUTH_ERROR" },
        });
      }

      return { ...data.user, token: data.token };
    },

    signin: async (_parent, args) => {
      const data = await signin(args.input);

      if (!data || !data.user || !data.token) {
        throw new GraphQLError("UNAUTHORIZED", {
          extensions: { code: "AUTH_ERROR" },
        });
      }

      return { ...data.user, token: data.token };
    },
  },
};

export default resolvers;

// TODO: filter issues by user
/* issuesForUser: async ({ email }: { email: string }, _, context) => {
  if (!context.user)
    throw new GraphQLError("UNAUTHORIZED", { extensions: { code: 401 } });

  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (user.length === 0) {
    throw new Error("User not found");
  }

  return await db.select().from(issues).where(eq(issues.userId, user[0].id));
}, */
