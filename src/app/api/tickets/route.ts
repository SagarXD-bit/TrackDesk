import { prisma } from "@/lib/prisma";
import { ticketSchema } from "@/lib/validations";
import { errorResponse, successResponse, parseSearchParams, getPaginationParams } from "@/lib/api-utils";
import { generateTicketNumber } from "@/lib/utils";

export async function GET(req: Request) {
  try {
    const params = parseSearchParams(req.url);
    const where: Record<string, unknown> = {};

    if (params.search) {
      where.OR = [
        { ticketNumber: { contains: params.search, mode: "insensitive" } },
        { title: { contains: params.search, mode: "insensitive" } },
        { customer: { name: { contains: params.search, mode: "insensitive" } } },
        { customer: { phone: { contains: params.search } } },
      ];
    }

    if (params.status) where.status = params.status;
    if (params.priority) where.priority = params.priority;
    if (params.employeeId) where.assignedToId = params.employeeId;

    if (params.from || params.to) {
      where.createdAt = {} as Record<string, Date>;
      if (params.from) (where.createdAt as Record<string, Date>).gte = new Date(params.from);
      if (params.to) (where.createdAt as Record<string, Date>).lte = new Date(params.to);
    }

    const [tickets, total] = await Promise.all([
      prisma.ticket.findMany({
        where,
        ...getPaginationParams(params.page, params.pageSize),
        orderBy: { createdAt: "desc" },
        include: {
          customer: true,
          assignedTo: { select: { id: true, name: true, email: true } },
          _count: { select: { attachments: true, timeline: true } },
        },
      }),
      prisma.ticket.count({ where }),
    ]);

    return successResponse({
      data: tickets,
      total,
      page: params.page,
      pageSize: params.pageSize,
      totalPages: Math.ceil(total / params.pageSize),
    });
  } catch (error) {
    console.error("Get tickets error:", error);
    return errorResponse("Internal server error", 500);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = ticketSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0].message, 400);
    }

    const data = parsed.data;
    const ticketNumber = generateTicketNumber();

    const ticket = await prisma.ticket.create({
      data: {
        ticketNumber,
        title: data.title,
        description: data.description || null,
        category: data.category || null,
        priority: data.priority || "MEDIUM",
        expectedDelivery: data.expectedDelivery ? new Date(data.expectedDelivery) : null,
        estimatedCost: data.estimatedCost ?? null,
        advancePaid: data.advancePaid ?? 0,
        remainingBalance: data.estimatedCost && data.advancePaid !== undefined
          ? data.estimatedCost - (data.advancePaid || 0)
          : null,
        notes: data.notes || null,
        customerId: data.customerId,
        assignedToId: data.assignedToId || null,
      },
      include: {
        customer: true,
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });

    await prisma.timeline.create({
      data: {
        action: "Ticket Created",
        details: `Ticket ${ticketNumber} was created`,
        ticketId: ticket.id,
      },
    });

    return successResponse(ticket, 201);
  } catch (error) {
    console.error("Create ticket error:", error);
    return errorResponse("Internal server error", 500);
  }
}
