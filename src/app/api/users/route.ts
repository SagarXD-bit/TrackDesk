import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse } from "@/lib/api-utils";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, active: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });
    return successResponse(users);
  } catch (error) {
    console.error("Get users error:", error);
    return errorResponse("Internal server error", 500);
  }
}
