import { NextRequest } from "next/server";

export type GQLContext = {
  req: NextRequest;
  getUser: () => Promise<{ id?: string; email: string; createdAt?: string } | null>;
};
