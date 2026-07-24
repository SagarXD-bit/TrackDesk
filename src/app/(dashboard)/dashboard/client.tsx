"use client";

import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate, formatCurrency } from "@/lib/utils";
import Link from "next/link";
import {
  Ticket, Clock, Wrench, Package, CheckCircle, DollarSign, TrendingUp, Activity, ArrowRight, Users,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

const statusColors: Record<string, string> = {
  RECEIVED: "#6B7280", DIAGNOSING: "#8B5CF6", WAITING_APPROVAL: "#F59E0B",
  WAITING_PARTS: "#F97316", REPAIR_IN_PROGRESS: "#B9FF66", QUALITY_CHECK: "#06B6D4",
  READY_FOR_PICKUP: "#10B981", DELIVERED: "#059669", CANCELLED: "#EF4444", CLOSED: "#191A23",
};

const statusLabels: Record<string, string> = {
  RECEIVED: "Received", DIAGNOSING: "Diagnosing", WAITING_APPROVAL: "Waiting",
  WAITING_PARTS: "Parts", REPAIR_IN_PROGRESS: "In Progress", QUALITY_CHECK: "QC",
  READY_FOR_PICKUP: "Ready", DELIVERED: "Delivered", CANCELLED: "Cancelled", CLOSED: "Closed",
};

export function DashboardClient({ stats }: { stats: any }) {
  const pieData = (stats.statusDistribution || []).map((s: any) => ({
    name: statusLabels[s.status] || s.status,
    value: s._count,
    color: statusColors[s.status] || "#6B7280",
  }));

  const cards = [
    { label: "Total Tickets", value: stats.totalTickets, icon: Ticket },
    { label: "Open", value: stats.openTickets, icon: Clock },
    { label: "Ready for Pickup", value: stats.readyForPickup, icon: Package },
    { label: "Delivered", value: stats.deliveredTickets, icon: TrendingUp },
    { label: "Cancelled", value: stats.cancelledTickets, icon: Clock },
    { label: "Today", value: stats.todayTickets, icon: Activity },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {cards.map((card) => (
          <Card key={card.label} className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-[#666]">{card.label}</p>
                <p className="mt-1 text-2xl font-bold text-[#191A23] dark:text-white">{card.value}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#B9FF66]/20 text-[#B9FF66]">
                <card.icon className="h-5 w-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <Card className="lg:col-span-1">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B9FF66]/20">
              <DollarSign className="h-6 w-6 text-[#B9FF66]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#666]">Monthly Revenue</p>
              <p className="text-2xl font-bold text-[#191A23] dark:text-white">
                {formatCurrency(stats.monthlyRevenue)}
              </p>
            </div>
          </div>
        </Card>
        <Card className="lg:col-span-1">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B9FF66]/20">
              <Users className="h-6 w-6 text-[#B9FF66]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#666]">Active Customers</p>
              <p className="text-2xl font-bold text-[#191A23] dark:text-white">{stats.activeCustomers}</p>
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <h3 className="mb-4 text-sm font-medium text-[#666]">Weekly Tickets</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.weeklyData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#D9D9D9" opacity={0.5} />
                <XAxis dataKey="name" stroke="#999" fontSize={12} />
                <YAxis stroke="#999" fontSize={12} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: "16px", border: "1px solid #D9D9D9", background: "#fff" }} />
                <Bar dataKey="tickets" fill="#B9FF66" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <h3 className="mb-4 text-sm font-medium text-[#666]">Status Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                  dataKey="value" label={({ name, percent }: any) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                  {pieData.map((entry: any, i: number) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: "16px", border: "1px solid #D9D9D9", background: "#fff" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-medium text-[#666]">Recent Activity</h3>
            <Link href="/tickets" className="flex items-center gap-1 text-sm font-medium text-[#B9FF66] hover:text-[#A3F53D]">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-2">
            {stats.recentTickets.length === 0 && (
              <p className="py-8 text-center text-sm text-[#666]">No tickets yet</p>
            )}
            {stats.recentTickets.map((ticket: any) => (
              <Link key={ticket.id} href={`/tickets/${ticket.id}`}
                className="flex items-center justify-between rounded-2xl border border-[#D9D9D9] p-3.5 transition-all duration-150 hover:border-[#B9FF66] hover:shadow-sm dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <Activity className="h-4 w-4 text-[#999]" />
                  <div>
                    <p className="text-sm font-medium text-[#191A23] dark:text-white">{ticket.ticketNumber}</p>
                    <p className="text-xs text-[#666]">{ticket.customer.name} &middot; {formatDate(ticket.updatedAt)}</p>
                  </div>
                </div>
                <StatusBadge status={ticket.status} />
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
