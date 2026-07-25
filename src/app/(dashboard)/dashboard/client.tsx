"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Ticket, Clock, Package, TrendingUp, DollarSign, Users, Activity, ArrowRight,
  CheckCircle, XCircle, Wrench,
} from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area,
} from "recharts";

const accentMap: Record<string, { color: string; glow: string; icon: typeof Ticket }> = {
  totalTickets: { color: "#06B6D4", glow: "glow-cyan", icon: Ticket },
  openTickets: { color: "#A855F7", glow: "glow-purple", icon: Clock },
  readyForPickup: { color: "#FB923C", glow: "glow-orange", icon: Package },
  deliveredTickets: { color: "#10B981", glow: "glow-emerald", icon: CheckCircle },
  cancelledTickets: { color: "#EF4444", glow: "glow-red", icon: XCircle },
  todayTickets: { color: "#EAB308", glow: "glow-yellow", icon: Activity },
};

const statusColors: Record<string, string> = {
  RECEIVED: "#6B7280", DIAGNOSING: "#8B5CF6", WAITING_APPROVAL: "#F59E0B",
  WAITING_PARTS: "#F97316", REPAIR_IN_PROGRESS: "#B9FF66", QUALITY_CHECK: "#06B6D4",
  READY_FOR_PICKUP: "#10B981", DELIVERED: "#059669", CANCELLED: "#EF4444", CLOSED: "#0A0A0A",
};

const statusLabels: Record<string, string> = {
  RECEIVED: "Received", DIAGNOSING: "Diagnosing", WAITING_APPROVAL: "Waiting",
  WAITING_PARTS: "Parts", REPAIR_IN_PROGRESS: "In Progress", QUALITY_CHECK: "QC",
  READY_FOR_PICKUP: "Ready", DELIVERED: "Delivered", CANCELLED: "Cancelled", CLOSED: "Closed",
};

function AnimatedNumber({ value, suffix = "", prefix = "" }: { value: number; suffix?: string; prefix?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<number>(0);
  useEffect(() => {
    const duration = 800;
    const steps = 30;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) { setDisplay(value); clearInterval(timer); }
      else setDisplay(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);
  return <>{prefix}{display.toLocaleString()}{suffix}</>;
}

function CounterCard({ label, value, accentKey, trend }: { label: string; value: number; accentKey: string; trend?: string }) {
  const a = accentMap[accentKey] || accentMap.totalTickets;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.25 } }}
      className={`relative rounded-2xl border border-white/[0.06] bg-[#131313]/80 backdrop-blur-xl p-5 transition-all duration-250 hover:${a.glow} cursor-default group`}
      style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
      {/* Hover border glow */}
      <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-250 pointer-events-none`}
        style={{ boxShadow: `inset 0 0 0 1px ${a.color}33` }} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-white/40 uppercase tracking-wider">{label}</p>
          <p className="mt-2 text-3xl font-bold text-white tracking-tight">
            <AnimatedNumber value={value} />
          </p>
          {trend && <p className="mt-1 text-xs text-white/30">{trend}</p>}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ background: `${a.color}15` }}>
          <a.icon className="h-5 w-5" style={{ color: a.color }} />
        </div>
      </div>
    </motion.div>
  );
}

const chartTooltipStyle = {
  borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)",
  background: "rgba(10,10,10,0.9)", backdropFilter: "blur(20px)",
  color: "#fff", fontSize: 13,
};

export function DashboardClient({ stats }: { stats: any }) {
  const pieData = (stats.statusDistribution || []).map((s: any) => ({
    name: statusLabels[s.status] || s.status, value: s._count,
    color: statusColors[s.status] || "#6B7280",
  }));

  // Sparkline for revenue card
  const sparkData = [4, 7, 3, 9, 5, 8, 12, 6, 10, 11, 9, stats.monthlyRevenue > 0 ? Math.floor(stats.monthlyRevenue / 100) : 5];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const } },
  };

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="show">
      {/* Revenue Feature Card */}
      <motion.div variants={fadeUp} className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-[#131313] via-[#131313] to-[#0A0A0A] p-6 sm:p-8 glow-emerald group"
        style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ boxShadow: "inset 0 0 0 1px rgba(16,185,129,0.2)" }} />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: "rgba(16,185,129,0.12)" }}>
              <DollarSign className="h-7 w-7 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-white/40 uppercase tracking-wider">Monthly Revenue</p>
              <p className="mt-1 text-4xl font-bold text-white tracking-tight">
                <AnimatedNumber value={stats.monthlyRevenue} prefix="$" />
              </p>
              <p className="mt-1 flex items-center gap-1 text-sm text-emerald-400">
                <span>↑ 12%</span>
                <span className="text-white/30">this month</span>
              </p>
            </div>
          </div>
          <div className="h-16 w-full sm:w-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparkData.map((v, i) => ({ v, i }))}>
                <defs>
                  <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotoneX" dataKey="v" stroke="#10B981" strokeWidth={2} fill="url(#sparkGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Active customers badge */}
        <div className="relative z-10 mt-4 flex items-center gap-2 text-xs text-white/30">
          <Users className="h-3 w-3" />
          <span><AnimatedNumber value={stats.activeCustomers} /> active customers this period</span>
        </div>
      </motion.div>

      {/* KPI Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {[
          { label: "Total Tickets", value: stats.totalTickets, key: "totalTickets" },
          { label: "Open", value: stats.openTickets, key: "openTickets" },
          { label: "Ready for Pickup", value: stats.readyForPickup, key: "readyForPickup" },
          { label: "Delivered", value: stats.deliveredTickets, key: "deliveredTickets" },
          { label: "Cancelled", value: stats.cancelledTickets, key: "cancelledTickets" },
          { label: "Today", value: stats.todayTickets, key: "todayTickets" },
        ].map((card) => (
          <motion.div key={card.key} variants={fadeUp}>
            <CounterCard label={card.label} value={card.value} accentKey={card.key} />
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Weekly Chart */}
        <motion.div variants={fadeUp} className="lg:col-span-3 relative rounded-2xl border border-white/[0.06] bg-[#131313]/80 backdrop-blur-xl p-5"
          style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
          <h3 className="mb-4 text-sm font-medium text-white/40 uppercase tracking-wider">Weekly Tickets</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.weeklyData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#B9FF66" stopOpacity={1} />
                    <stop offset="100%" stopColor="#B9FF66" stopOpacity={0.4} />
                  </linearGradient>
                </defs>
                <Bar dataKey="tickets" fill="url(#barGrad)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Status Distribution */}
        <motion.div variants={fadeUp} className="lg:col-span-2 relative rounded-2xl border border-white/[0.06] bg-[#131313]/80 backdrop-blur-xl p-5"
          style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
          <h3 className="mb-4 text-sm font-medium text-white/40 uppercase tracking-wider">Status</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={78}
                  dataKey="value" paddingAngle={2}>
                  {pieData.map((entry: any, i: number) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={chartTooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <motion.div variants={fadeUp} className="lg:col-span-2 relative rounded-2xl border border-white/[0.06] bg-[#131313]/80 backdrop-blur-xl p-5"
          style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-medium text-white/40 uppercase tracking-wider">Recent Activity</h3>
            <Link href="/tickets" className="flex items-center gap-1 text-xs font-medium text-[#B9FF66] hover:text-[#A3F53D] transition-colors">
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {stats.recentTickets.length === 0 && (
              <p className="py-8 text-center text-sm text-white/30">No tickets yet</p>
            )}
            {stats.recentTickets.map((ticket: any, i: number) => (
              <motion.div key={ticket.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                <Link href={`/tickets/${ticket.id}`}
                  className="flex items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.02] p-3 transition-all duration-200 hover:bg-white/[0.04] hover:border-white/[0.08] group">
                  <div className="flex items-center gap-3 min-w-0">
                    <Activity className="h-4 w-4 shrink-0 text-white/20" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white/70 truncate">{ticket.ticketNumber}</p>
                      <p className="text-xs text-white/30 truncate">{ticket.customer?.name} &middot; {formatDate(ticket.updatedAt)}</p>
                    </div>
                  </div>
                  <StatusBadge status={ticket.status} />
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Technician Performance / Quick Stats */}
        <motion.div variants={fadeUp} className="relative rounded-2xl border border-white/[0.06] bg-[#131313]/80 backdrop-blur-xl p-5"
          style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
          <h3 className="mb-4 text-sm font-medium text-white/40 uppercase tracking-wider">Quick Stats</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-white/50">Total Tickets</span>
                <span className="text-xs font-medium text-white/80">{stats.totalTickets}</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                <motion.div className="h-full rounded-full bg-gradient-to-r from-[#B9FF66] to-[#A3F53D]"
                  initial={{ width: 0 }} animate={{ width: "100%" }}
                  transition={{ duration: 1, delay: 0.3, ease: "easeOut" }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-white/50">Open</span>
                <span className="text-xs font-medium text-white/80">{stats.openTickets}</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                <motion.div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-purple-400"
                  initial={{ width: 0 }} animate={{ width: `${stats.totalTickets ? (stats.openTickets / stats.totalTickets) * 100 : 0}%` }}
                  transition={{ duration: 1, delay: 0.4, ease: "easeOut" }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-white/50">Delivered</span>
                <span className="text-xs font-medium text-white/80">{stats.deliveredTickets}</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                <motion.div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                  initial={{ width: 0 }} animate={{ width: `${stats.totalTickets ? (stats.deliveredTickets / stats.totalTickets) * 100 : 0}%` }}
                  transition={{ duration: 1, delay: 0.5, ease: "easeOut" }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-white/50">Revenue</span>
                <span className="text-xs font-medium text-white/80">{formatCurrency(stats.monthlyRevenue)}</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                <motion.div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                  initial={{ width: 0 }} animate={{ width: `${Math.min(100, (stats.monthlyRevenue / 5000) * 100)}%` }}
                  transition={{ duration: 1, delay: 0.6, ease: "easeOut" }} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
