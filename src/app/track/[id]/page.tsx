import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { TICKET_STATUS_LABELS, STATUS_COLORS } from "@/types";
import type { TicketStatus } from "@/types";
import { CheckCircle, Clock, Package, Wrench, ShieldCheck, XCircle } from "lucide-react";

export const dynamic = "force-dynamic";

const statusIcons: Record<string, React.ReactNode> = {
  RECEIVED: <Clock className="h-5 w-5" />,
  DIAGNOSING: <Wrench className="h-5 w-5" />,
  WAITING_APPROVAL: <Clock className="h-5 w-5" />,
  WAITING_PARTS: <Package className="h-5 w-5" />,
  REPAIR_IN_PROGRESS: <Wrench className="h-5 w-5" />,
  QUALITY_CHECK: <ShieldCheck className="h-5 w-5" />,
  READY_FOR_PICKUP: <CheckCircle className="h-5 w-5" />,
  DELIVERED: <CheckCircle className="h-5 w-5" />,
  CANCELLED: <XCircle className="h-5 w-5" />,
};

const statusFlow = [
  "RECEIVED",
  "DIAGNOSING",
  "WAITING_APPROVAL",
  "WAITING_PARTS",
  "REPAIR_IN_PROGRESS",
  "QUALITY_CHECK",
  "READY_FOR_PICKUP",
  "DELIVERED",
];

export default async function TrackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: {
      timeline: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!ticket) notFound();

  const currentStatusIndex = statusFlow.indexOf(ticket.status);
  const statusLabel = TICKET_STATUS_LABELS[ticket.status as TicketStatus];

  const isCancelled = ticket.status === "CANCELLED";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 py-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Ticket Tracker</h1>
          <p className="mt-1 text-sm text-gray-500">Track your service ticket status</p>
        </div>

        {/* Ticket Info Card */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="text-center">
            <p className="text-sm text-gray-500">Ticket Number</p>
            <h2 className="text-2xl font-bold text-gray-900">{ticket.ticketNumber}</h2>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <span
                className={`mt-1 inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                  STATUS_COLORS[ticket.status as TicketStatus]
                }`}
              >
                {statusLabel}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Title</p>
              <p className="font-medium text-gray-900">{ticket.title}</p>
            </div>
            {ticket.expectedDelivery && (
              <div>
                <p className="text-sm text-gray-500">Expected Completion</p>
                <p className="font-medium text-gray-900">
                  {new Date(ticket.expectedDelivery).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Status Progress */}
        {!isCancelled && (
          <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Progress
            </h3>
            <div className="space-y-0">
              {statusFlow.map((status, index) => {
                const isCompleted = index <= currentStatusIndex;
                const isCurrent = index === currentStatusIndex;
                const label = TICKET_STATUS_LABELS[status as TicketStatus];

                return (
                  <div key={status} className="flex items-center gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          isCompleted
                            ? "gradient-bg text-white"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {statusIcons[status]}
                      </div>
                      {index < statusFlow.length - 1 && (
                        <div
                        className={`h-6 w-0.5 ${
                          isCompleted && index < currentStatusIndex
                            ? "bg-indigo-500"
                            : "bg-gray-200"
                        }`}
                        />
                      )}
                    </div>
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          isCurrent
                            ? "text-indigo-600"
                            : isCompleted
                            ? "text-gray-900"
                            : "text-gray-400"
                        }`}
                      >
                        {label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Cancelled Banner */}
        {isCancelled && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-6 text-center">
            <XCircle className="mx-auto h-8 w-8 text-red-500" />
            <h3 className="mt-2 text-lg font-semibold text-red-700">Ticket Cancelled</h3>
            <p className="text-sm text-red-500">This service ticket has been cancelled.</p>
          </div>
        )}

        {/* Timeline */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Updates
          </h3>
          <div className="space-y-4">
            {ticket.timeline.length === 0 && (
              <p className="py-4 text-center text-sm text-gray-400">No updates yet</p>
            )}
            {ticket.timeline.map((entry) => (
              <div key={entry.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <div className="h-full w-px bg-gray-200" />
                </div>
                <div className="flex-1 pb-4">
                  <p className="text-sm font-medium text-gray-900">{entry.action}</p>
                  {entry.details && (
                    <p className="text-xs text-gray-500">{entry.details}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-400">{formatDate(entry.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
