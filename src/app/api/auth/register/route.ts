import { prisma } from "@/lib/prisma";
import { hashPassword, signToken } from "@/lib/auth";
import { registerSchema } from "@/lib/validations";
import { errorResponse, successResponse } from "@/lib/api-utils";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0].message, 400);
    }

    const { email, name, password, role } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return errorResponse("Email already in use", 409);
    }

    const hashed = await hashPassword(password);
    const user = await prisma.user.create({
      data: { email, name, password: hashed, role: role || "EMPLOYEE" },
      select: { id: true, email: true, name: true, role: true },
    });

    const token = signToken(user);

    return successResponse({ user, token }, 201);
  } catch (error) {
    console.error("Register error:", error);
    return errorResponse("Internal server error", 500);
  }
}
