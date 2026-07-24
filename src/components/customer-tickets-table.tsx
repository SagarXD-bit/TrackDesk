"use client";

import { useRouter } from "next/navigation";
import { TICKET_STATUS_LABELS, STATUS_COLORS, PRIORITY_LABELS, PRIORITY_COLORS } from "@/types";
import { formatDate } from "@/lib/utils";

export function CustomerTicketsTable({ tickets }: { tickets: any[] }) {
  const router = useRouter();

  if (tickets.length === 0) {
    return <p className="py-8 text-center text-sm text-gray-500">No tickets yet</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="px-4 py-3 font-medium text-gray-500">Ticket #</th>
            <th className="px-4 py-3 font-medium text-gray-500">Title</th>
            <th className="px-4 py-3 font-medium text-gray-500">Status</th>
            <th className="px-4 py-3 font-medium text-gray-500">Priority</th>
            <th className="px-4 py-3 font-medium text-gray-500">Assigned</th>
            <th className="px-4 py-3 font-medium text-gray-500">Created</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {tickets.map((ticket: any) => (
            <tr
              key={ticket.id}
              className="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
              onClick={() => router.push(`/tickets/${ticket.id}`)}
            >
              <td className="px-4 py-3 font-medium text-blue-600">{ticket.ticketNumber}</td>
              <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{ticket.title}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    STATUS_COLORS[ticket.status as keyof typeof STATUS_COLORS]
                  }`}
                >
                  {TICKET_STATUS_LABELS[ticket.status as keyof typeof TICKET_STATUS_LABELS]}
                </span>
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    PRIORITY_COLORS[ticket.priority as keyof typeof PRIORITY_COLORS]
                  }`}
                >
                  {PRIORITY_LABELS[ticket.priority as keyof typeof PRIORITY_LABELS]}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                {ticket.assignedTo?.name || "—"}
              </td>
              <td className="px-4 py-3 text-gray-500">{formatDate(ticket.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
