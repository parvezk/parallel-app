/**
 * Defines the API route for handling GraphQL requests.
 */
import { NextRequest, NextResponse } from "next/server";
import { graphql } from "graphql";
import { makeExecutableSchema } from "@graphql-tools/schema";
// locals
import resolvers from "./resolvers";
import { getUserFromToken } from "@/utils/auth";
import typeDefs from "./typeDefs";

// Create the GraphQL schema with resolvers
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export async function POST(req: NextRequest) {
  try {
    const { query, variables } = await req.json();

    const context = (req: NextRequest) => {
      let userPromise: Promise<any> | null = null;

      const getUser = () => {
        if (!userPromise) {
          userPromise = getUserFromToken(req.headers.get("authorization") ?? "");
        }
        return userPromise;
      };

      return { req, getUser };
    };

    const response = await graphql({
      schema,
      source: query,
      variableValues: variables,
      contextValue: context(req),
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("API Error:", error); // Log error details
    return NextResponse.json(
      { errors: [{ message: error.message }] },
      { status: 500 }
    );
  }
}

// OPTIONS requests are handled completely by middleware.ts now
// So we can omit the OPTIONS handler here, or keep it empty
export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
