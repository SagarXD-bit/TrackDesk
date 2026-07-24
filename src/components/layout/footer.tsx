import { ClipboardCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[#D9D9D9] bg-white dark:border-gray-700 dark:bg-gray-900">
      <div className="flex flex-col items-center gap-2 px-6 py-4 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center rounded-lg bg-[#B9FF66] p-1 text-[#191A23]">
            <ClipboardCheck className="h-4 w-4" />
          </div>
          <span className="text-sm font-bold text-[#191A23] dark:text-white">Track Desk</span>
        </div>
        <p className="text-xs text-[#666]">&copy; {new Date().getFullYear()} Track Desk. All rights reserved.</p>
      </div>
    </footer>
  );
}
