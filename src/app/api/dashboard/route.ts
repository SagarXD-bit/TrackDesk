import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse } from "@/lib/api-utils";

export async function GET() {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000);

    const [
      totalTickets,
      openTickets,
      readyForPickup,
      deliveredTickets,
      cancelledTickets,
      todayTickets,
      activeCustomers,
      monthlyRevenue,
      recentTickets,
      statusDistribution,
      weeklyTickets,
    ] = await Promise.all([
      prisma.ticket.count(),
      prisma.ticket.count({ where: { status: { notIn: ["DELIVERED", "CANCELLED", "CLOSED"] } } }),
      prisma.ticket.count({ where: { status: "READY_FOR_PICKUP" } }),
      prisma.ticket.count({ where: { status: "DELIVERED" } }),
      prisma.ticket.count({ where: { status: "CANCELLED" } }),
      prisma.ticket.count({ where: { createdAt: { gte: startOfToday } } }),
      prisma.customer.count({ where: { tickets: { some: {} } } }),
      prisma.ticket.aggregate({
        where: { status: "CLOSED", closedDate: { gte: startOfMonth } },
        _sum: { finalCost: true },
      }),
      prisma.ticket.findMany({
        orderBy: { updatedAt: "desc" },
        take: 10,
        include: {
          customer: { select: { id: true, name: true, phone: true } },
          assignedTo: { select: { id: true, name: true } },
        },
      }),
      prisma.ticket.groupBy({ by: ["status"], _count: true }),
      // Real weekly data from last 7 days
      Promise.all(
        Array.from({ length: 7 }, (_, i) => {
          const day = new Date(sevenDaysAgo);
          day.setDate(day.getDate() + i);
          const nextDay = new Date(day);
          nextDay.setDate(nextDay.getDate() + 1);
          return prisma.ticket.count({
            where: { createdAt: { gte: day, lt: nextDay } },
          }).then((count) => ({
            name: day.toLocaleDateString("en", { weekday: "short" }),
            tickets: count,
          }));
        })
      ),
    ]);

    return successResponse({
      totalTickets,
      openTickets,
      readyForPickup,
      deliveredTickets,
      cancelledTickets,
      monthlyRevenue: monthlyRevenue._sum.finalCost || 0,
      todayTickets,
      activeCustomers,
      recentTickets: JSON.parse(JSON.stringify(recentTickets)),
      statusDistribution: JSON.parse(JSON.stringify(statusDistribution)),
      weeklyData: weeklyTickets,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return errorResponse("Internal server error", 500);
  }
}
