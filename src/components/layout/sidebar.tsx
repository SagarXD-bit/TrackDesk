"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Ticket, Users, Settings, LogIn, ChevronLeft, X,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "./logo";
import { useSidebar } from "./sidebar-context";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tickets", label: "Tickets", icon: Ticket },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { mobileOpen, closeMobile, collapsed, toggleCollapsed } = useSidebar();
  const activeRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => { closeMobile(); }, [pathname, closeMobile]);

  const sidebarContent = (
    <aside className={cn(
      "flex h-full flex-col bg-[#0A0A0A] border-r border-white/[0.04] transition-all duration-300",
      collapsed ? "w-16" : "w-64",
    )}>
      <div className="flex h-16 shrink-0 items-center justify-between px-4 border-b border-white/[0.04]">
        {!collapsed && <Link href="/dashboard"><Logo /></Link>}
        <button onClick={toggleCollapsed}
          className="hidden lg:flex rounded-xl p-1.5 text-white/30 hover:text-white/70 hover:bg-white/5 transition-all">
          <ChevronLeft className={cn("h-5 w-5 transition-transform duration-300", collapsed && "rotate-180")} />
        </button>
        <button onClick={closeMobile}
          className="flex lg:hidden rounded-xl p-1.5 text-white/30 hover:text-white/70 hover:bg-white/5 transition-all">
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} ref={isActive ? activeRef : undefined}
              className={cn(
                "relative flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 overflow-hidden",
                isActive
                  ? "text-[#0A0A0A]"
                  : "text-white/40 hover:text-white/80 hover:bg-white/[0.03]",
              )}>
              {isActive && (
                <motion.div layoutId="sidebar-active"
                  className="absolute inset-0 rounded-2xl bg-[#B9FF66]"
                  transition={{ type: "spring", stiffness: 400, damping: 35 }} />
              )}
              <span className="relative z-10 flex items-center gap-3">
                <item.icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="shrink-0 border-t border-white/[0.04] p-3">
        <Link href="/login"
          className="flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-medium text-white/30 transition-all duration-200 hover:text-white/60 hover:bg-white/[0.03]">
          <LogIn className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Sign In</span>}
        </Link>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:flex h-screen shrink-0">
        {sidebarContent}
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={closeMobile} />
            <motion.div className={cn("fixed left-0 top-0 h-full", collapsed ? "w-16" : "w-64")}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}>
              {sidebarContent}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
