import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { QRCodeSVG } from "qrcode.react";
import type { TicketStatus } from "@/types";
import { TICKET_STATUS_LABELS } from "@/types";

export const dynamic = "force-dynamic";

export default async function PrintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: { customer: true },
  });

  if (!ticket) notFound();

  const trackingUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/track/${ticket.id}`;
  const statusLabel = TICKET_STATUS_LABELS[ticket.status as TicketStatus] || ticket.status;

  return (
    <div className="mx-auto max-w-2xl p-8">
      <div className="rounded-lg border-2 border-gray-300 p-8">
        {/* Header */}
        <div className="mb-8 text-center border-b pb-6">
          <h1 className="text-2xl font-bold gradient-text">Track Desk</h1>
          <p className="text-sm text-gray-500">Service Ticket</p>
        </div>

        {/* Ticket Number */}
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900">{ticket.ticketNumber}</h2>
          <p className="text-sm text-gray-500">
            Created: {new Date(ticket.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Customer Details */}
        <div className="mb-6">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Customer Details
          </h3>
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="font-medium text-gray-900">{ticket.customer.name}</p>
            <p className="text-sm text-gray-600">{ticket.customer.phone}</p>
            {ticket.customer.email && (
              <p className="text-sm text-gray-600">{ticket.customer.email}</p>
            )}
          </div>
        </div>

        {/* Ticket Details */}
        <div className="mb-6">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Service Details
          </h3>
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="mb-2">
              <p className="text-sm text-gray-500">Title</p>
              <p className="font-medium text-gray-900">{ticket.title}</p>
            </div>
            {ticket.description && (
              <div className="mb-2">
                <p className="text-sm text-gray-500">Description</p>
                <p className="text-gray-700">{ticket.description}</p>
              </div>
            )}
            {ticket.category && (
              <div className="mb-2">
                <p className="text-sm text-gray-500">Category</p>
                <p className="text-gray-700">{ticket.category}</p>
              </div>
            )}
          </div>
        </div>

        {/* Status & Cost */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Status</p>
            <p className="text-lg font-bold text-gray-900">{statusLabel}</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Estimated Cost</p>
            <p className="text-lg font-bold text-gray-900">
              {ticket.estimatedCost ? formatCurrency(ticket.estimatedCost) : "—"}
            </p>
          </div>
          {ticket.expectedDelivery && (
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Expected Delivery</p>
              <p className="font-medium text-gray-900">
                {new Date(ticket.expectedDelivery).toLocaleDateString()}
              </p>
            </div>
          )}
          {ticket.advancePaid ? (
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Advance Paid</p>
              <p className="font-medium text-gray-900">{formatCurrency(ticket.advancePaid)}</p>
            </div>
          ) : null}
        </div>

        {/* QR Code + Signature */}
        <div className="flex items-end justify-between border-t pt-6">
          <div className="text-center">
            <QRCodeSVG value={trackingUrl} size={100} />
            <p className="mt-1 text-xs text-gray-500">Scan to track</p>
          </div>
          <div className="text-center">
            <div className="mb-8 border-b border-gray-400 w-48"></div>
            <p className="text-sm text-gray-500">Authorized Signature</p>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-gray-400">
          <p>Track your ticket: {trackingUrl}</p>
        </div>
      </div>

      <div className="no-print mt-4 text-center">
        <button
          onClick={() => window.print()}
          className="rounded-lg gradient-bg px-6 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          Print This Ticket
        </button>
      </div>
    </div>
  );
}
