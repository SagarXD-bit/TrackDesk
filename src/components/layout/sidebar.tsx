"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Ticket, Users, Settings, LogIn, ChevronLeft, X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Logo } from "./logo";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tickets", label: "Tickets", icon: Ticket },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const sidebarContent = (
    <aside className={cn(
      "flex h-screen flex-col bg-[#191A23] transition-all duration-200",
      collapsed ? "w-16" : "w-64",
    )}>
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
        {!collapsed && (
          <Link href="/dashboard"><Logo /></Link>
        )}
        <button onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex rounded-xl p-1.5 text-white/50 hover:bg-white/10 hover:text-white">
          <ChevronLeft className={cn("h-5 w-5 transition-transform", collapsed && "rotate-180")} />
        </button>
        <button onClick={() => setMobileOpen(false)}
          className="flex lg:hidden rounded-xl p-1.5 text-white/50 hover:bg-white/10 hover:text-white">
          <X className="h-5 w-5" />
        </button>
      </div>
      <nav className="flex-1 space-y-1 p-3">
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
      <div className="border-t border-white/10 p-3">
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
      {/* Desktop: always visible */}
      <div className="hidden lg:flex">{sidebarContent}</div>

      {/* Mobile: drawer with backdrop */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="relative animate-in slide-in-from-left">{sidebarContent}</div>
        </div>
      )}

      {/* Mobile hamburger button */}
      <button onClick={() => setMobileOpen(true)}
        className="fixed bottom-4 left-4 z-40 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B9FF66] text-[#191A23] shadow-lg lg:hidden">
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </>
  );
}
