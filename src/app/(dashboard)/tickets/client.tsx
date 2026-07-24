"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { StatusBadge, PriorityBadge } from "@/components/ui/status-badge";
import { formatDate } from "@/lib/utils";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

interface TicketsClientProps {
  tickets: any[];
  total: number;
  page: number;
  pageSize: number;
  employees: { id: string; name: string }[];
}

export function TicketsClient({ tickets, total, page, pageSize, employees }: TicketsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const totalPages = Math.ceil(total / pageSize);

  function handleFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    if (key !== "page") params.set("page", "1");
    router.push(`/tickets?${params.toString()}`);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    handleFilter("search", search);
  }

  return (
    <Card className="p-0 overflow-hidden">
      <div className="p-5 pb-0">
        <div className="mb-4 flex flex-wrap gap-3">
          <form onSubmit={handleSearch} className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999]" />
            <input
              type="text"
              placeholder="Search tickets, customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border-2 border-[#D9D9D9] bg-[#F5F5F5] py-2.5 pl-10 pr-4 text-sm text-[#191A23] transition-all duration-150 placeholder:text-[#999] focus:border-[#B9FF66] focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
            />
          </form>
          <select
            value={searchParams.get("status") || ""}
            onChange={(e) => handleFilter("status", e.target.value)}
            className="rounded-2xl border-2 border-[#D9D9D9] bg-white px-4 py-2.5 text-sm text-[#191A23] transition-all duration-150 focus:border-[#B9FF66] focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="">All Status</option>
            <option value="RECEIVED">Received</option>
            <option value="DIAGNOSING">Diagnosing</option>
            <option value="WAITING_APPROVAL">Waiting Approval</option>
            <option value="WAITING_PARTS">Waiting Parts</option>
            <option value="REPAIR_IN_PROGRESS">In Progress</option>
            <option value="QUALITY_CHECK">Quality Check</option>
            <option value="READY_FOR_PICKUP">Ready</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <select
            value={searchParams.get("priority") || ""}
            onChange={(e) => handleFilter("priority", e.target.value)}
            className="rounded-2xl border-2 border-[#D9D9D9] bg-white px-4 py-2.5 text-sm text-[#191A23] transition-all duration-150 focus:border-[#B9FF66] focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="">All Priority</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-y border-[#D9D9D9] dark:border-gray-700">
              <th className="px-5 py-3.5 font-medium text-[#666] dark:text-gray-400">Ticket #</th>
              <th className="px-5 py-3.5 font-medium text-[#666] dark:text-gray-400">Customer</th>
              <th className="px-5 py-3.5 font-medium text-[#666] dark:text-gray-400">Title</th>
              <th className="px-5 py-3.5 font-medium text-[#666] dark:text-gray-400">Status</th>
              <th className="px-5 py-3.5 font-medium text-[#666] dark:text-gray-400">Priority</th>
              <th className="px-5 py-3.5 font-medium text-[#666] dark:text-gray-400">Assigned To</th>
              <th className="px-5 py-3.5 font-medium text-[#666] dark:text-gray-400">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D9D9D9] dark:divide-gray-700">
            {tickets.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-[#666] dark:text-gray-400">
                  No tickets found
                </td>
              </tr>
            )}
            {tickets.map((ticket) => (
              <tr
                key={ticket.id}
                className="cursor-pointer transition-colors duration-150 hover:bg-[#F2FFD9] dark:hover:bg-gray-700/50"
                onClick={() => router.push(`/tickets/${ticket.id}`)}
              >
                <td className="px-5 py-3.5 font-medium text-[#191A23] dark:text-white">
                  {ticket.ticketNumber}
                </td>
                <td className="px-5 py-3.5">
                  <p className="font-medium text-[#191A23] dark:text-white">{ticket.customer.name}</p>
                  <p className="text-xs text-[#666]">{ticket.customer.phone}</p>
                </td>
                <td className="max-w-[200px] truncate px-5 py-3.5 text-[#191A23] dark:text-gray-300">
                  {ticket.title}
                </td>
                <td className="px-5 py-3.5">
                  <StatusBadge status={ticket.status} />
                </td>
                <td className="px-5 py-3.5">
                  <PriorityBadge priority={ticket.priority} />
                </td>
                <td className="px-5 py-3.5 text-[#666] dark:text-gray-400">
                  {ticket.assignedTo?.name || "—"}
                </td>
                <td className="px-5 py-3.5 text-sm text-[#999]">
                  {formatDate(ticket.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-[#D9D9D9] px-5 py-3.5 dark:border-gray-700">
          <p className="text-sm text-[#666]">
            Page {page} of {totalPages} ({total} total)
          </p>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => handleFilter("page", String(page - 1))}
              className="rounded-2xl border-2 border-[#D9D9D9] px-3.5 py-1.5 text-sm text-[#191A23] transition-all duration-150 hover:border-[#B9FF66] disabled:opacity-50 dark:border-gray-600 dark:text-gray-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => handleFilter("page", String(page + 1))}
              className="rounded-2xl border-2 border-[#D9D9D9] px-3.5 py-1.5 text-sm text-[#191A23] transition-all duration-150 hover:border-[#B9FF66] disabled:opacity-50 dark:border-gray-600 dark:text-gray-100"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}
