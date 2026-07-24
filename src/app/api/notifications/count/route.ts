import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { errorResponse, successResponse } from "@/lib/api-utils";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return successResponse({ count: 0 });
    const count = await prisma.notification.count({ where: { userId: user.id, read: false } });
    return successResponse({ count });
  } catch {
    return successResponse({ count: 0 });
  }
}
