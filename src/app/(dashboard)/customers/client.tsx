"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { Search, ChevronLeft, ChevronRight, Phone, Mail, Ticket, Loader2 } from "lucide-react";

export function CustomersClient({ customers: initial, total: initialTotal, page: initialPage, pageSize }: any) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [results, setResults] = useState(initial);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const totalPages = Math.ceil(total / pageSize);

  const doSearch = useCallback(async (q: string, p: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set("search", q);
      params.set("page", String(p));
      params.set("pageSize", String(pageSize));
      const res = await fetch(`/api/customers?${params}`);
      const d = await res.json();
      if (d.data) {
        setResults(d.data.data);
        setTotal(d.data.total);
        setPage(d.data.page);
      }
    } catch {} finally { setLoading(false); }
  }, [pageSize]);

  useEffect(() => {
    const timer = setTimeout(() => doSearch(search, 1), 300);
    return () => clearTimeout(timer);
  }, [search, doSearch]);

  function goToPage(p: number) {
    doSearch(search, p);
  }

  return (
    <Card className="p-0 overflow-hidden">
      <div className="p-5 pb-0">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999]" />
          <input type="text" placeholder="Search by name, phone, or email..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border-2 border-[#D9D9D9] bg-[#F5F5F5] py-2.5 pl-10 pr-4 text-sm text-[#191A23] transition-all duration-150 placeholder:text-[#999] focus:border-[#B9FF66] focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100" />
          {loading && <Loader2 className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-[#B9FF66]" />}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-y border-[#D9D9D9] dark:border-gray-700">
              <th className="px-5 py-3.5 font-medium text-[#666]">Name</th>
              <th className="px-5 py-3.5 font-medium text-[#666]">Contact</th>
              <th className="px-5 py-3.5 font-medium text-[#666]">Tickets</th>
              <th className="px-5 py-3.5 font-medium text-[#666]">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D9D9D9] dark:divide-gray-700">
            {results.length === 0 && (
              <tr><td colSpan={4} className="px-5 py-12 text-center text-[#666]">No customers found</td></tr>
            )}
            {results.map((customer: any) => (
              <tr key={customer.id}
                className="cursor-pointer transition-colors duration-150 hover:bg-[#F2FFD9] dark:hover:bg-gray-700/50"
                onClick={() => router.push(`/customers/${customer.id}`)}>
                <td className="px-5 py-3.5 font-medium text-[#191A23] dark:text-white">{customer.name}</td>
                <td className="px-5 py-3.5">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1 text-[#666]"><Phone className="h-3 w-3" /><span>{customer.phone}</span></div>
                    {customer.email && <div className="flex items-center gap-1 text-[#999]"><Mail className="h-3 w-3" /><span>{customer.email}</span></div>}
                  </div>
                </td>
                <td className="px-5 py-3.5"><div className="flex items-center gap-1 text-[#666]"><Ticket className="h-3 w-3" /><span>{customer._count?.tickets || 0}</span></div></td>
                <td className="px-5 py-3.5 text-[#999]">{formatDate(customer.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-[#D9D9D9] px-5 py-3.5 dark:border-gray-700">
          <p className="text-sm text-[#666]">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => goToPage(page - 1)}
              className="rounded-2xl border-2 border-[#D9D9D9] px-3.5 py-1.5 text-sm text-[#191A23] transition-all duration-150 hover:border-[#B9FF66] disabled:opacity-50">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button disabled={page >= totalPages} onClick={() => goToPage(page + 1)}
              className="rounded-2xl border-2 border-[#D9D9D9] px-3.5 py-1.5 text-sm text-[#191A23] transition-all duration-150 hover:border-[#B9FF66] disabled:opacity-50">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}
