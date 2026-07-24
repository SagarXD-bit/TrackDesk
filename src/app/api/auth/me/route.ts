import { getCurrentUser } from "@/lib/auth";
import { errorResponse, successResponse } from "@/lib/api-utils";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return errorResponse("Not authenticated", 401);
    }
    return successResponse({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (error) {
    console.error("Me error:", error);
    return errorResponse("Internal server error", 500);
  }
}
