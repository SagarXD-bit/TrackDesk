"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Ticket, Users, Package, UserCog, BarChart3, PieChart, Settings, LogIn, ChevronLeft, X,
} from "lucide-react";
import { useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "./logo";
import { useSidebar } from "./sidebar-context";

const mainNav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tickets", label: "Tickets", icon: Ticket },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/inventory", label: "Inventory", icon: Package },
];

const secondaryNav = [
  { href: "/employees", label: "Employees", icon: UserCog },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/analytics", label: "Analytics", icon: PieChart },
  { href: "/settings", label: "Settings", icon: Settings },
];

const NavItem = memo(function NavItem({ href, label, icon: Icon, collapsed }: { href: string; label: string; icon: typeof LayoutDashboard; collapsed: boolean }) {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);

  return (
    <Link href={href}
      className={cn(
        "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-100",
        collapsed ? "justify-center" : "px-3",
        isActive ? "text-[#0A0A0A]" : "text-sidebar-muted hover:text-sidebar",
      )}>
      {isActive && (
        <motion.div layoutId="pill"
          className="absolute inset-0 rounded-xl bg-[#B9FF66] pointer-events-none"
          transition={{ type: "spring", stiffness: 600, damping: 45 }} />
      )}
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full bg-[#191A23] pointer-events-none" />
      )}
      {!isActive && (
        <div className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-100 bg-sidebar-hover pointer-events-none" />
      )}
      <Icon className={cn(
        "h-[18px] w-[18px] shrink-0 transition-colors duration-100 relative z-10",
        isActive ? "text-[#191A23]" : "text-sidebar-muted group-hover:text-sidebar",
      )} />
      {!collapsed && <span className="relative z-10">{label}</span>}
      {!collapsed && isActive && (
        <span className="ml-auto relative z-10 w-1.5 h-1.5 rounded-full bg-[#191A23]" />
      )}
    </Link>
  );
});

export function Sidebar() {
  const { mobileOpen, closeMobile, collapsed, toggleCollapsed } = useSidebar();
  useEffect(() => { closeMobile(); }, [closeMobile]);

  const sidebarInner = (closeCb?: () => void) => (
    <>
      <div className={cn("flex shrink-0 items-center border-b border-theme", collapsed ? "h-16 justify-center" : "h-[72px] px-5")}>
        {collapsed ? <Logo collapsed /> : (
          <>
            <Logo />
            <button onClick={() => { toggleCollapsed(); closeCb?.(); }} className="ml-auto flex items-center justify-center rounded-lg w-7 h-7 text-sidebar-muted hover:text-sidebar hover:bg-sidebar-hover transition-colors duration-100">
              <ChevronLeft className={cn("h-4 w-4 transition-transform duration-200", collapsed && "rotate-180")} />
            </button>
          </>
        )}
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        <div>
          {!collapsed && <div className="px-3 pb-1.5"><span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-sidebar-muted/60">Main</span></div>}
          <div className="space-y-0.5">{mainNav.map((item) => <NavItem key={item.href} {...item} collapsed={collapsed} />)}</div>
        </div>
        <div>
          {!collapsed && <div className="px-3 pb-1.5"><span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-sidebar-muted/60">Management</span></div>}
          <div className="space-y-0.5">{secondaryNav.map((item) => <NavItem key={item.href} {...item} collapsed={collapsed} />)}</div>
        </div>
      </nav>
      <div className="shrink-0 border-t border-theme p-3">
        <Link href="/login" className={cn("flex items-center gap-3 rounded-xl text-sm font-medium transition-colors duration-100 group", collapsed ? "justify-center py-2.5" : "px-3 py-2.5")}>
          <LogIn className="h-[18px] w-[18px] shrink-0 text-sidebar-muted group-hover:text-sidebar transition-colors duration-100" />
          {!collapsed && <><span className="text-sidebar-muted group-hover:text-sidebar transition-colors duration-100">Sign In</span></>}
        </Link>
      </div>
    </>
  );

  return (
    <>
      <aside className={cn("hidden lg:flex h-screen shrink-0 flex-col bg-sidebar border-r border-theme", collapsed ? "w-16" : "w-60")}>
        {sidebarInner()}
      </aside>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }}>
            <div className="fixed inset-0 bg-black/50" onClick={closeMobile} />
            <motion.div className={cn("fixed left-0 top-0 h-full bg-sidebar border-r border-theme", collapsed ? "w-16" : "w-60")}
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}>
              {sidebarInner(closeMobile)}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
