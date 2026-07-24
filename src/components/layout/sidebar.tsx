"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Ticket, Users, Settings, LogIn, ChevronLeft, X,
} from "lucide-react";
import { useEffect } from "react";
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

  useEffect(() => {
    closeMobile();
  }, [pathname, closeMobile]);

  const sidebarContent = (
    <aside className={cn(
      "flex h-full flex-col bg-[#191A23] transition-all duration-200",
      collapsed ? "w-16" : "w-64",
    )}>
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-4">
        {!collapsed && (
          <Link href="/dashboard"><Logo /></Link>
        )}
        <button onClick={toggleCollapsed}
          className="hidden lg:flex rounded-xl p-1.5 text-white/50 hover:bg-white/10 hover:text-white">
          <ChevronLeft className={cn("h-5 w-5 transition-transform", collapsed && "rotate-180")} />
        </button>
        <button onClick={closeMobile}
          className="flex lg:hidden rounded-xl p-1.5 text-white/50 hover:bg-white/10 hover:text-white">
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-medium transition-all duration-150",
                isActive ? "bg-[#B9FF66] text-[#191A23]" : "text-white/70 hover:bg-white/10 hover:text-white",
              )}>
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="shrink-0 border-t border-white/10 p-3">
        <Link href="/login"
          className="flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-medium text-white/50 transition-all duration-150 hover:bg-white/10 hover:text-white">
          <LogIn className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Sign In</span>}
        </Link>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop: permanently visible */}
      <div className="hidden lg:flex h-screen shrink-0">
        {sidebarContent}
      </div>

      {/* Mobile/Tablet: slide-in drawer with backdrop */}
      <div className={cn(
        "fixed inset-0 z-50 lg:hidden transition-opacity duration-200",
        mobileOpen ? "visible opacity-100" : "invisible opacity-0",
      )}>
        <div className="fixed inset-0 bg-black/50" onClick={closeMobile} />
        <div className={cn(
          "fixed left-0 top-0 h-full transition-transform duration-200",
          collapsed ? "w-16" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}>
          {sidebarContent}
        </div>
      </div>
    </>
  );
}
