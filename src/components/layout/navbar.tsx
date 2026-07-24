"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Bell, Search } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

interface Notification {
  id: string;
  type: string;
  message: string;
  link: string | null;
  read: boolean;
  createdAt: string;
}

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    fetch("/api/notifications/count").then(r => r.json()).then(d => {
      if (d.data) setUnreadCount(d.data.count);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function toggleNotifications() {
    if (!notifOpen) {
      const res = await fetch("/api/notifications");
      const d = await res.json();
      if (d.data) {
        setNotifications(d.data.notifications);
        setUnreadCount(d.data.unreadCount);
      }
    }
    setNotifOpen(!notifOpen);
  }

  async function markAllRead() {
    await fetch("/api/notifications", { method: "PATCH" });
    setUnreadCount(0);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-[#D9D9D9] bg-white/90 px-4 sm:px-6 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/90">
      <div className="relative hidden sm:block flex-1 max-w-md">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999]" />
        <input type="text" placeholder="Search..."
          className="w-full rounded-2xl border-2 border-[#D9D9D9] bg-[#F5F5F5] py-2 pl-10 pr-4 text-sm text-[#191A23] transition-all duration-150 placeholder:text-[#999] focus:border-[#B9FF66] focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100" />
      </div>
      <div className="flex items-center gap-2 ml-auto">
        {mounted && (
          <Button variant="ghost" size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        )}
        <div ref={notifRef} className="relative">
          <Button variant="ghost" size="sm" onClick={toggleNotifications}>
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Button>
          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl border border-[#D9D9D9] bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between border-b border-[#D9D9D9] px-4 py-3 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-[#191A23] dark:text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-xs font-medium text-[#B9FF66] hover:text-[#A3F53D]">
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 && (
                  <p className="px-4 py-8 text-center text-sm text-[#666]">No notifications</p>
                )}
                {notifications.map((n) => (
                  <Link key={n.id} href={n.link || "#"}
                    onClick={() => setNotifOpen(false)}
                    className={`block px-4 py-3 text-sm transition-colors hover:bg-[#F2FFD9] dark:hover:bg-gray-700 ${
                      !n.read ? "border-l-2 border-[#B9FF66]" : ""
                    }`}>
                    <p className="font-medium text-[#191A23] dark:text-white">{n.message}</p>
                    <p className="mt-0.5 text-xs text-[#999]">{formatDate(n.createdAt)}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
