import { prisma } from "@/lib/prisma";
import { TicketsClient } from "./client";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ search?: string; status?: string; priority?: string; page?: string }>;
}

export default async function TicketsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1"));
  const pageSize = 10;

  const where: Record<string, unknown> = {};
  if (params.search) {
    where.OR = [
      { ticketNumber: { contains: params.search, mode: "insensitive" } },
      { customer: { name: { contains: params.search, mode: "insensitive" } } },
      { customer: { phone: { contains: params.search } } },
    ];
  }
  if (params.status) where.status = params.status;
  if (params.priority) where.priority = params.priority;

  const [tickets, total, employees] = await Promise.all([
    prisma.ticket.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: {
        customer: { select: { id: true, name: true, phone: true } },
        assignedTo: { select: { id: true, name: true } },
      },
    }),
    prisma.ticket.count({ where }),
    prisma.user.findMany({
      where: { active: true },
      select: { id: true, name: true },
    }),
  ]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Tickets</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {total} total ticket{total !== 1 ? "s" : ""}
          </p>
        </div>
        <a
          href="/tickets/new"
          className="inline-flex items-center rounded-lg gradient-bg px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          New Ticket
        </a>
      </div>
      <TicketsClient
        tickets={JSON.parse(JSON.stringify(tickets))}
        total={total}
        page={page}
        pageSize={pageSize}
        employees={JSON.parse(JSON.stringify(employees))}
      />
    </div>
  );
}
