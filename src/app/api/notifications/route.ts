import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { errorResponse, successResponse } from "@/lib/api-utils";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return errorResponse("Not authenticated", 401);

    const [notifications, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
      prisma.notification.count({ where: { userId: user.id, read: false } }),
    ]);

    return successResponse({ notifications, unreadCount });
  } catch (error) {
    console.error("Get notifications error:", error);
    return errorResponse("Internal server error", 500);
  }
}

export async function PATCH() {
  try {
    const user = await getCurrentUser();
    if (!user) return errorResponse("Not authenticated", 401);

    await prisma.notification.updateMany({
      where: { userId: user.id, read: false },
      data: { read: true },
    });

    return successResponse({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Mark notifications error:", error);
    return errorResponse("Internal server error", 500);
  }
}
