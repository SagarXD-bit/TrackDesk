import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { ticketUpdateSchema } from "@/lib/validations";
import { errorResponse, successResponse } from "@/lib/api-utils";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        customer: true,
        assignedTo: { select: { id: true, name: true, email: true } },
        closedBy: { select: { id: true, name: true } },
        timeline: { orderBy: { createdAt: "desc" } },
        attachments: true,
      },
    });
    if (!ticket) return errorResponse("Ticket not found", 404);
    return successResponse(ticket);
  } catch (error) {
    console.error("Get ticket error:", error);
    return errorResponse("Internal server error", 500);
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    const { id } = await params;
    const body = await req.json();
    const parsed = ticketUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0].message, 400);
    }

    const existing = await prisma.ticket.findUnique({ where: { id } });
    if (!existing) return errorResponse("Ticket not found", 404);
    if (existing.status === "CLOSED") return errorResponse("Closed tickets cannot be edited", 400);

    const data = parsed.data;
    const updateData: Record<string, unknown> = {};
    const timelineEntries: { action: string; details: string; ticketId: string; employeeId?: string }[] = [];

    if (data.title) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.priority) updateData.priority = data.priority;
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.assignedToId !== undefined) updateData.assignedToId = data.assignedToId;
    if (data.expectedDelivery !== undefined) {
      updateData.expectedDelivery = data.expectedDelivery ? new Date(data.expectedDelivery) : null;
    }
    if (data.estimatedCost !== undefined) updateData.estimatedCost = data.estimatedCost;
    if (data.advancePaid !== undefined) updateData.advancePaid = data.advancePaid;
    if (data.finalCost !== undefined) updateData.finalCost = data.finalCost;
    if (data.paymentStatus !== undefined) updateData.paymentStatus = data.paymentStatus;
    if (data.paymentMethod !== undefined) updateData.paymentMethod = data.paymentMethod;

    if (data.estimatedCost != null && data.advancePaid != null) {
      updateData.remainingBalance = data.estimatedCost - data.advancePaid;
    }

    // Closing workflow
    if (data.status === "CLOSED" && existing.status !== "CLOSED" as any) {
      updateData.status = "CLOSED";
      updateData.closedDate = new Date();
      updateData.closedById = user?.id || existing.assignedToId;
      if (!data.finalCost && existing.estimatedCost) {
        updateData.finalCost = existing.estimatedCost;
      }
      timelineEntries.push({
        action: "Ticket Closed",
        details: `Ticket closed with final cost: $${(data.finalCost || existing.estimatedCost || 0).toFixed(2)}`,
        ticketId: id,
        employeeId: user?.id,
      });
    } else if (data.status && data.status !== existing.status) {
      updateData.status = data.status;
      timelineEntries.push({
        action: "Status Changed",
        details: `Status changed to ${data.status}`,
        ticketId: id,
        employeeId: user?.id,
      });
    }

    if (data.assignedToId !== undefined && data.assignedToId !== (existing.assignedToId ?? null)) {
      timelineEntries.push({
        action: "Assignment Changed",
        details: "Employee assignment updated",
        ticketId: id,
        employeeId: user?.id,
      });
    }

    const [ticket] = await Promise.all([
      prisma.ticket.update({
        where: { id },
        data: updateData,
        include: {
          customer: true,
          assignedTo: { select: { id: true, name: true, email: true } },
          closedBy: { select: { id: true, name: true } },
          timeline: { orderBy: { createdAt: "desc" } },
          attachments: true,
        },
      }),
      ...timelineEntries.map((entry) => prisma.timeline.create({ data: entry })),
      // Create notifications for employees
      ...(data.status === "CLOSED"
        ? [prisma.notification.createMany({
            data: [{
              type: "ticket_closed",
              message: `Ticket ${existing.ticketNumber} has been closed`,
              link: `/tickets/${id}`,
              userId: user?.id || existing.assignedToId || "unknown",
            }],
          })]
        : []),
    ]);

    return successResponse(ticket);
  } catch (error) {
    console.error("Update ticket error:", error);
    return errorResponse("Internal server error", 500);
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await prisma.ticket.findUnique({ where: { id } });
    if (!existing) return errorResponse("Ticket not found", 404);

    await Promise.all([
      prisma.timeline.deleteMany({ where: { ticketId: id } }),
      prisma.attachment.deleteMany({ where: { ticketId: id } }),
    ]);
    await prisma.ticket.delete({ where: { id } });
    return successResponse({ message: "Ticket deleted" });
  } catch (error) {
    console.error("Delete ticket error:", error);
    return errorResponse("Internal server error", 500);
  }
}
