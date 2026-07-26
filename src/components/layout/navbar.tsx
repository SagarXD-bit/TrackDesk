"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Bell, Search, Menu } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar-context";

interface Notification {
  id: string; type: string; message: string; link: string | null; read: boolean; createdAt: string;
}

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchFocused, setSearchFocused] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const { openMobile } = useSidebar();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    fetch("/api/notifications/count").then(r => r.json()).then(d => {
      if (d.data) setUnreadCount(d.data.count);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); searchRef.current?.focus(); }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  async function toggleNotifications() {
    if (!notifOpen) {
      const res = await fetch("/api/notifications");
      const d = await res.json();
      if (d.data) { setNotifications(d.data.notifications); setUnreadCount(d.data.unreadCount); }
    }
    setNotifOpen(!notifOpen);
  }

  async function markAllRead() {
    await fetch("/api/notifications", { method: "PATCH" });
    setUnreadCount(0);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 px-4 border-b border-theme bg-theme">
      <button onClick={openMobile}
        className="flex lg:hidden rounded-xl p-2 text-muted hover:text-secondary hover:bg-hover transition-all">
        <Menu className="h-5 w-5" />
      </button>

      <div className={cn("relative flex-1 max-w-md transition-all duration-300", searchFocused ? "scale-[1.02]" : "scale-100")}>
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input ref={searchRef} type="text" placeholder="Search..."
          onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
          className={cn(
            "w-full rounded-2xl py-2 pl-10 pr-14 text-sm text-theme placeholder:text-muted/50 transition-all duration-300 outline-none",
            "bg-search border border-theme",
            "focus:bg-hover focus:border-[var(--search-focus)]",
          )} />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-0.5 rounded-lg bg-hover px-1.5 py-0.5 text-[10px] font-medium text-muted">
          <span className="text-xs">⌘</span>K
        </kbd>
        {searchFocused && (
          <motion.div className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#B9FF66]/50 to-transparent"
            layoutId="search-glow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
        )}
      </div>

      <div className="flex items-center gap-1.5 ml-auto">
        {mounted && (
          <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-xl p-2 text-muted hover:text-secondary hover:bg-hover transition-all">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        )}
        <div ref={notifRef} className="relative">
          <button onClick={toggleNotifications}
            className="relative rounded-xl p-2 text-muted hover:text-secondary hover:bg-hover transition-all">
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#B9FF66] text-[8px] font-bold text-[#0A0A0A]">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
          <AnimatePresence>
            {notifOpen && (
              <motion.div initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl border border-theme bg-card shadow-lg overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-theme">
                  <h3 className="text-sm font-semibold text-theme">Notifications</h3>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-xs font-medium text-[#B9FF66] hover:text-[#A3F53D] transition-colors">
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 && <p className="px-4 py-8 text-center text-sm text-muted">No notifications</p>}
                  {notifications.map((n) => (
                    <Link key={n.id} href={n.link || "#"} onClick={() => setNotifOpen(false)}
                      className={`block px-4 py-3 text-sm transition-colors hover:bg-hover ${!n.read ? "border-l-2 border-[#B9FF66]" : ""}`}>
                      <p className="font-medium text-theme">{n.message}</p>
                      <p className="mt-0.5 text-xs text-muted">{formatDate(n.createdAt)}</p>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
