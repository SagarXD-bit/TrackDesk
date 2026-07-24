import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "./prisma";
import type { User } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";
const TOKEN_NAME = "session";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(user: Pick<User, "id" | "email" | "role">): string {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
  } catch {
    return null;
  }
}

export async function createSession(user: Pick<User, "id" | "email" | "role">) {
  const token = signToken(user);
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });
  return token;
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_NAME);
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession();
  if (!session) return null;
  try {
    const user = await prisma.user.findUnique({ where: { id: session.id } });
    return user;
  } catch {
    return null;
  }
}

export function requireAuth<T extends unknown[]>(
  handler: (req: Request, user: User, ...args: T) => Promise<Response>
) {
  return async (req: Request, ...args: T) => {
    const user = await getCurrentUser();
    if (!user) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    return handler(req, user, ...args);
  };
}

export function requireAdmin<T extends unknown[]>(
  handler: (req: Request, user: User, ...args: T) => Promise<Response>
) {
  return async (req: Request, ...args: T) => {
    const user = await getCurrentUser();
    if (!user) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    if (user.role !== "ADMIN") {
      return Response.json({ success: false, error: "Forbidden" }, { status: 403 });
    }
    return handler(req, user, ...args);
  };
}
