import { prisma } from "@/lib/prisma";
import { TicketForm } from "../form";

export const dynamic = "force-dynamic";

export default async function NewTicketPage() {
  const [customers, employees] = await Promise.all([
    prisma.customer.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, phone: true },
    }),
    prisma.user.findMany({
      where: { active: true },
      select: { id: true, name: true },
    }),
  ]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">New Ticket</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Create a new service ticket</p>
      </div>
      <TicketForm
        customers={JSON.parse(JSON.stringify(customers))}
        employees={JSON.parse(JSON.stringify(employees))}
      />
    </div>
  );
}
