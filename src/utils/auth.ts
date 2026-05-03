import jwt from "jsonwebtoken";
import { db } from "@/db/db";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";
import bcrypt from "bcrypt";

const SECRET = "use_an_ENV_VAR";

export const createTokenForUser = (user: { id: string; email: string; createdAt: string }) => {
  const token = jwt.sign({ id: user.id, email: user.email, createdAt: user.createdAt }, SECRET);
  return token;
};

export const getUserFromToken = async (header?: string) => {
  if (!header) {
    return null;
  }

  const token = (header.split("Bearer")[1] ?? "").trim();

  try {
    const decoded = jwt.verify(token, SECRET) as { id: string; email?: string; createdAt?: string };
    if (!decoded.email || !decoded.createdAt) {
      const dbUser = await db.query.users.findFirst({
        where: eq(users.id, decoded.id),
        columns: { id: true, email: true, createdAt: true },
      });
      return dbUser;
    }
    return { id: decoded.id, email: decoded.email, createdAt: decoded.createdAt };
  } catch (e) {
    console.error("invalid jwt", e);
    return null;
  }
};

export const signin = async ({
  email,
  password: inputPassword,
}: {
  email: string;
  password: string;
}) => {
  const match = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!match) return null;
  const correctPW = await comparePW(inputPassword, match.password);

  if (!correctPW) return null;

  const token = createTokenForUser(match);
  const { password: _password, ...user } = match;

  return { user, token };
};

export const signup = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters long');
  }

  const hashedPW = await hashPW(password);
  const rows = await db
    .insert(users)
    .values({ email, password: hashedPW })
    .returning({
      id: users.id,
      email: users.email,
      createdAt: users.createdAt,
    });

  const user = rows[0];
  const token = createTokenForUser(user);

  return { user, token };
};

const hashPW = (password: string) => {
  return bcrypt.hash(password, 10);
};

const comparePW = (password: string, hashedPW: string) => {
  return bcrypt.compare(password, hashedPW);
};
