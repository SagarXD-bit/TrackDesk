import { prisma } from "@/lib/prisma";
import { DashboardClient } from "./client";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000);

  const [
    totalTickets, openTickets, readyForPickup, deliveredTickets,
    cancelledTickets, todayTickets, activeCustomers, monthlyRevenue,
    recentTickets, statusDistribution,
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
      orderBy: { updatedAt: "desc" }, take: 10,
      include: { customer: { select: { id: true, name: true, phone: true } }, assignedTo: { select: { id: true, name: true } } },
    }),
    prisma.ticket.groupBy({ by: ["status"], _count: true }),
  ]);

  const weeklyData = await Promise.all(
    Array.from({ length: 7 }, (_, i) => {
      const day = new Date(sevenDaysAgo);
      day.setDate(day.getDate() + i);
      const nextDay = new Date(day);
      nextDay.setDate(nextDay.getDate() + 1);
      return prisma.ticket.count({ where: { createdAt: { gte: day, lt: nextDay } } })
        .then((count) => ({ name: day.toLocaleDateString("en", { weekday: "short" }), tickets: count }));
    })
  );

  const stats = {
    totalTickets, openTickets, readyForPickup, deliveredTickets, cancelledTickets,
    monthlyRevenue: monthlyRevenue._sum.finalCost || 0, todayTickets, activeCustomers,
    recentTickets: JSON.parse(JSON.stringify(recentTickets)),
    statusDistribution: JSON.parse(JSON.stringify(statusDistribution)), weeklyData,
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-white/90 tracking-tight">Dashboard</h1>
        <p className="text-sm text-white/40">Real-time overview of your business</p>
      </div>
      <DashboardClient stats={stats} />
    </div>
  );
}
