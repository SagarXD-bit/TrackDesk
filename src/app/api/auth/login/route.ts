import { prisma } from "@/lib/prisma";
import { verifyPassword, createSession } from "@/lib/auth";
import { loginSchema } from "@/lib/validations";
import { errorResponse, successResponse } from "@/lib/api-utils";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0].message, 400);
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return errorResponse("Invalid credentials", 401);
    }

    const valid = await verifyPassword(password, user.password);
    if (!valid) {
      return errorResponse("Invalid credentials", 401);
    }

    if (!user.active) {
      return errorResponse("Account is disabled", 403);
    }

    await createSession({ id: user.id, email: user.email, role: user.role });

    return successResponse({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (error) {
    console.error("Login error:", error);
    return errorResponse("Internal server error", 500);
  }
}
