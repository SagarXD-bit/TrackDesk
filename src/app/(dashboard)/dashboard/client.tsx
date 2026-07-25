"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Ticket, Clock, Package, DollarSign, Users, Activity, ArrowRight,
  CheckCircle, XCircle,
} from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area,
} from "recharts";

const accentMap: Record<string, { color: string; icon: typeof Ticket }> = {
  totalTickets: { color: "#06B6D4", icon: Ticket },
  openTickets: { color: "#A855F7", icon: Clock },
  readyForPickup: { color: "#FB923C", icon: Package },
  deliveredTickets: { color: "#10B981", icon: CheckCircle },
  cancelledTickets: { color: "#EF4444", icon: XCircle },
  todayTickets: { color: "#EAB308", icon: Activity },
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

function AnimatedNumber({ value, prefix = "" }: { value: number; prefix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const duration = 800, steps = 30, inc = value / steps;
    let cur = 0;
    const t = setInterval(() => { cur += inc; if (cur >= value) { setDisplay(value); clearInterval(t); } else setDisplay(Math.floor(cur)); }, duration / steps);
    return () => clearInterval(t);
  }, [value]);
  return <>{prefix}{display.toLocaleString()}</>;
}

function KpiCard({ label, value, accentKey }: { label: string; value: number; accentKey: string }) {
  const a = accentMap[accentKey] || accentMap.totalTickets;
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="card p-5 cursor-default group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted uppercase tracking-wider">{label}</p>
          <p className="mt-1.5 text-3xl font-bold text-theme tracking-tight"><AnimatedNumber value={value} /></p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl shrink-0" style={{ background: `${a.color}12` }}>
          <a.icon className="h-5 w-5" style={{ color: a.color }} />
        </div>
      </div>
    </motion.div>
  );
}

const tooltipStyle = { borderRadius: 12, border: "1px solid var(--border)", background: "var(--card-bg)", color: "var(--text-primary)", fontSize: 13 };

export function DashboardClient({ stats }: { stats: any }) {
  const pieData = (stats.statusDistribution || []).map((s: any) => ({
    name: statusLabels[s.status] || s.status, value: s._count, color: statusColors[s.status] || "#6B7280",
  }));
  const spark = stats.monthlyRevenue > 0 ? [2, 4, 6, 5, 8, 7, 10, 9, 11, 10, 12, Math.floor(stats.monthlyRevenue / 100)] : [1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7];

  const variants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
  const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, duration: 0.45 } };

  return (
    <motion.div className="space-y-5" variants={variants} initial="hidden" animate="show">
      {/* Revenue */}
      <motion.div variants={fadeUp} className="card p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 shrink-0">
              <DollarSign className="h-7 w-7 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted uppercase tracking-wider">Monthly Revenue</p>
              <p className="mt-1 text-4xl font-bold text-theme tracking-tight"><AnimatedNumber value={stats.monthlyRevenue} prefix="$" /></p>
              <p className="mt-1 flex items-center gap-1 text-sm text-emerald-400">
                <span>↑ 12%</span><span className="text-muted">this month</span>
              </p>
            </div>
          </div>
          <div className="h-14 w-full sm:w-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={spark.map((v, i) => ({ v, i }))}>
                <defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10B981" stopOpacity={0.2} /><stop offset="100%" stopColor="#10B981" stopOpacity={0} /></linearGradient></defs>
                <Area type="monotoneX" dataKey="v" stroke="#10B981" strokeWidth={1.5} fill="url(#s)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-muted">
          <Users className="h-3 w-3" />
          <span><AnimatedNumber value={stats.activeCustomers} /> active customers</span>
        </div>
      </motion.div>

      {/* KPI Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {[
          { l: "Total Tickets", v: stats.totalTickets, k: "totalTickets" },
          { l: "Open", v: stats.openTickets, k: "openTickets" },
          { l: "Ready for Pickup", v: stats.readyForPickup, k: "readyForPickup" },
          { l: "Delivered", v: stats.deliveredTickets, k: "deliveredTickets" },
          { l: "Cancelled", v: stats.cancelledTickets, k: "cancelledTickets" },
          { l: "Today", v: stats.todayTickets, k: "todayTickets" },
        ].map((c) => <motion.div key={c.k} variants={fadeUp}><KpiCard label={c.l} value={c.v} accentKey={c.k} /></motion.div>)}
      </div>

      {/* Charts */}
      <div className="grid gap-5 lg:grid-cols-5">
        <motion.div variants={fadeUp} className="lg:col-span-3 card p-5">
          <h3 className="mb-4 text-xs font-semibold text-muted uppercase tracking-wider">Weekly Tickets</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.weeklyData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#B9FF66" stopOpacity={1} /><stop offset="100%" stopColor="#B9FF66" stopOpacity={0.3} /></linearGradient></defs>
                <Bar dataKey="tickets" fill="url(#bg)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="lg:col-span-2 card p-5">
          <h3 className="mb-4 text-xs font-semibold text-muted uppercase tracking-wider">Status</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={76} dataKey="value" paddingAngle={2}>
                  {pieData.map((e: any, i: number) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Bottom */}
      <div className="grid gap-5 lg:grid-cols-3">
        <motion.div variants={fadeUp} className="lg:col-span-2 card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider">Recent Activity</h3>
            <Link href="/tickets" className="flex items-center gap-1 text-xs font-medium text-[#B9FF66] hover:text-[#A3F53D] transition-colors">View All <ArrowRight className="h-3 w-3" /></Link>
          </div>
          <div className="space-y-1.5">
            {stats.recentTickets.length === 0 && <p className="py-8 text-center text-sm text-muted">No tickets yet</p>}
            {stats.recentTickets.map((t: any, i: number) => (
              <motion.div key={t.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                <Link href={`/tickets/${t.id}`}
                  className="flex items-center justify-between rounded-lg p-3 transition-colors duration-150 hover:bg-hover">
                  <div className="flex items-center gap-3 min-w-0">
                    <Activity className="h-4 w-4 shrink-0 text-muted" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-theme truncate">{t.ticketNumber}</p>
                      <p className="text-xs text-muted truncate">{t.customer?.name} &middot; {formatDate(t.updatedAt)}</p>
                    </div>
                  </div>
                  <StatusBadge status={t.status} />
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="card p-5">
          <h3 className="mb-4 text-xs font-semibold text-muted uppercase tracking-wider">Quick Stats</h3>
          <div className="space-y-4">
            {[
              { l: "Total Tickets", v: stats.totalTickets, m: stats.totalTickets || 1, c: "from-[#B9FF66] to-[#A3F53D]" },
              { l: "Open", v: stats.openTickets, m: stats.totalTickets || 1, c: "from-purple-500 to-purple-400" },
              { l: "Delivered", v: stats.deliveredTickets, m: stats.totalTickets || 1, c: "from-emerald-500 to-emerald-400" },
              { l: "Revenue", v: Math.min(100, Math.round((stats.monthlyRevenue / 5000) * 100)), m: 100, c: "from-emerald-500 to-teal-400", s: "%" },
            ].map((item, i) => (
              <div key={item.l}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted">{item.l}</span>
                  <span className="text-xs font-medium text-secondary">{item.s ? `${item.v}${item.s}` : item.v}</span>
                </div>
                <div className="h-1.5 rounded-full bg-hover overflow-hidden">
                  <motion.div className={`h-full rounded-full bg-gradient-to-r ${item.c}`}
                    initial={{ width: 0 }} animate={{ width: `${(item.v / item.m) * 100}%` }}
                    transition={{ duration: 0.8, delay: 0.2 + i * 0.08, ease: "easeOut" }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
