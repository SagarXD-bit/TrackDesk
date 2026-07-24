import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Phone, Mail, MapPin, FileText, Ticket, ArrowLeft, Plus } from "lucide-react";
import { CustomerTicketsTable } from "@/components/customer-tickets-table";

export const dynamic = "force-dynamic";

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      tickets: {
        orderBy: { createdAt: "desc" },
        include: {
          assignedTo: { select: { id: true, name: true } },
        },
      },
    },
  });

  if (!customer) notFound();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/customers"
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {customer.name}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Customer since {formatDate(customer.createdAt)}
            </p>
          </div>
        </div>
        <Link
          href={`/tickets/new`}
          className="inline-flex items-center rounded-lg gradient-bg px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          <Plus className="mr-1 h-4 w-4" /> New Ticket
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <Card>
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
              Contact Info
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Phone className="h-4 w-4" />
                <span>{customer.phone}</span>
              </div>
              {customer.email && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Mail className="h-4 w-4" />
                  <span>{customer.email}</span>
                </div>
              )}
              {customer.address && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <MapPin className="h-4 w-4" />
                  <span>{customer.address}</span>
                </div>
              )}
            </div>
          </Card>

          {customer.notes && (
            <Card>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-5 w-5 text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Notes</h2>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{customer.notes}</p>
            </Card>
          )}
        </div>

        <div className="lg:col-span-2">
          <Card>
            <div className="mb-4 flex items-center gap-2">
              <Ticket className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Tickets ({customer.tickets.length})
              </h2>
            </div>
            <CustomerTicketsTable tickets={customer.tickets} />
          </Card>
        </div>
      </div>
    </div>
  );
}
