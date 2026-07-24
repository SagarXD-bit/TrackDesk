import { prisma } from "@/lib/prisma";
import { customerSchema } from "@/lib/validations";
import { errorResponse, successResponse, parseSearchParams, getPaginationParams } from "@/lib/api-utils";

export async function GET(req: Request) {
  try {
    const params = parseSearchParams(req.url);
    const where: Record<string, unknown> = {};

    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: "insensitive" } },
        { phone: { contains: params.search } },
        { email: { contains: params.search, mode: "insensitive" } },
      ];
    }

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        ...getPaginationParams(params.page, params.pageSize),
        orderBy: { createdAt: "desc" },
        include: {
          _count: { select: { tickets: true } },
        },
      }),
      prisma.customer.count({ where }),
    ]);

    return successResponse({
      data: customers,
      total,
      page: params.page,
      pageSize: params.pageSize,
      totalPages: Math.ceil(total / params.pageSize),
    });
  } catch (error) {
    console.error("Get customers error:", error);
    return errorResponse("Internal server error", 500);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = customerSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0].message, 400);
    }

    const customer = await prisma.customer.create({
      data: parsed.data,
    });

    return successResponse(customer, 201);
  } catch (error) {
    console.error("Create customer error:", error);
    return errorResponse("Internal server error", 500);
  }
}
