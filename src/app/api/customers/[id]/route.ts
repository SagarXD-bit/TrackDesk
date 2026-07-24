import { prisma } from "@/lib/prisma";
import { customerSchema } from "@/lib/validations";
import { errorResponse, successResponse } from "@/lib/api-utils";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        tickets: {
          orderBy: { createdAt: "desc" },
          include: {
            assignedTo: { select: { id: true, name: true, email: true } },
            _count: { select: { attachments: true, timeline: true } },
          },
        },
      },
    });

    if (!customer) {
      return errorResponse("Customer not found", 404);
    }

    return successResponse(customer);
  } catch (error) {
    console.error("Get customer error:", error);
    return errorResponse("Internal server error", 500);
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = customerSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0].message, 400);
    }

    const customer = await prisma.customer.update({
      where: { id },
      data: parsed.data,
    });

    return successResponse(customer);
  } catch (error) {
    console.error("Update customer error:", error);
    return errorResponse("Internal server error", 500);
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const tickets = await prisma.ticket.findMany({ where: { customerId: id }, select: { id: true } });
    const ticketIds = tickets.map((t) => t.id);

    await Promise.all([
      prisma.timeline.deleteMany({ where: { ticketId: { in: ticketIds } } }),
      prisma.attachment.deleteMany({ where: { ticketId: { in: ticketIds } } }),
    ]);
    await prisma.ticket.deleteMany({ where: { customerId: id } });
    await prisma.customer.delete({ where: { id } });

    return successResponse({ message: "Customer deleted" });
  } catch (error) {
    console.error("Delete customer error:", error);
    return errorResponse("Internal server error", 500);
  }
}
