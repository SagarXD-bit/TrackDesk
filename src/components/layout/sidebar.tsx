"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Ticket, Users, Settings, LogIn, ChevronLeft, X,
} from "lucide-react";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "./logo";
import { useSidebar } from "./sidebar-context";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tickets", label: "Tickets", icon: Ticket },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
];

function NavItem({ href, label, icon: Icon, collapsed }: { href: string; label: string; icon: typeof LayoutDashboard; collapsed: boolean }) {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);

  return (
    <Link href={href}
      className={cn(
        "relative group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
        collapsed ? "justify-center px-0" : "px-3",
        isActive ? "text-white" : "text-[#B8B8B8] hover:text-white",
      )}>
      {/* Active pill */}
      {isActive && (
        <motion.div layoutId="nav-pill"
          className="absolute inset-0 rounded-xl bg-white/[0.06]"
          transition={{ type: "spring", stiffness: 400, damping: 35 }} />
      )}

      {/* Left accent bar */}
      {isActive && (
        <motion.div layoutId="nav-accent"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full bg-[#B9FF66]"
          transition={{ type: "spring", stiffness: 400, damping: 35 }} />
      )}

      {/* Hover bg */}
      {!isActive && (
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/[0.04]" />
      )}

      <Icon className={cn(
        "h-5 w-5 shrink-0 transition-all duration-200 relative z-10",
        isActive ? "text-[#B9FF66]" : "text-[#B8B8B8] group-hover:text-white",
      )} />

      {!collapsed && <span className="relative z-10">{label}</span>}
    </Link>
  );
}

export function Sidebar() {
  const { mobileOpen, closeMobile, collapsed, toggleCollapsed } = useSidebar();
  useEffect(() => { closeMobile(); }, [closeMobile]);

  const sidebarContent = (
    <aside className={cn(
      "flex h-full flex-col bg-sidebar border-r border-theme transition-all duration-300",
      collapsed ? "w-16" : "w-60",
    )}>
      {/* Logo */}
      <div className={cn(
        "flex shrink-0 items-center border-b border-theme",
        collapsed ? "h-16 justify-center px-0" : "h-20 px-5",
      )}>
        {collapsed ? (
          <Logo collapsed />
        ) : (
          <>
            <Logo />
            <div className="ml-auto">
              <button onClick={toggleCollapsed}
                className="flex items-center justify-center rounded-lg w-7 h-7 text-muted hover:text-secondary hover:bg-hover transition-all">
                <ChevronLeft className="h-4 w-4 transition-transform duration-300" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {!collapsed && (
          <div className="px-3 pb-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">Main Menu</span>
          </div>
        )}
        {navItems.map((item) => (
          <NavItem key={item.href} {...item} collapsed={collapsed} />
        ))}
      </nav>

      {/* Bottom */}
      <div className="shrink-0 border-t border-theme p-3">
        <Link href="/login"
          className={cn(
            "flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200 group",
            collapsed ? "justify-center py-2.5" : "px-3 py-2.5",
          )}>
          <LogIn className={cn(
            "h-5 w-5 shrink-0 transition-all duration-200",
            "text-[#B8B8B8] group-hover:text-white",
          )} />
          {!collapsed && (
            <>
              <span className="text-[#B8B8B8] group-hover:text-white transition-colors duration-200">Sign In</span>
              <span className="ml-auto text-[10px] text-muted">⌘I</span>
            </>
          )}
        </Link>
      </div>
    </aside>
  );

  return (
    <>
      <div className="hidden lg:flex h-screen shrink-0">{sidebarContent}</div>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <div className="fixed inset-0 bg-black/50" onClick={closeMobile} />
            <motion.div
              className={cn("fixed left-0 top-0 h-full", collapsed ? "w-16" : "w-60")}
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}>
              {sidebarContent}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
