import { ClipboardCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="shrink-0 border-t border-[#D9D9D9] bg-white dark:border-gray-700 dark:bg-gray-900">
      <div className="flex flex-col items-center gap-2 px-4 py-4 sm:flex-row sm:justify-between sm:px-6">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center rounded-lg bg-[#B9FF66] p-1 text-[#191A23]">
            <ClipboardCheck className="h-4 w-4" />
          </div>
          <span className="text-sm font-bold text-[#191A23] dark:text-white">Track Desk</span>
        </div>
        <p className="text-xs text-[#666]">
          Built by{" "}
          <a
            href="https://sagar-rawat.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[#191A23] underline underline-offset-2 transition-colors hover:text-[#B9FF66] dark:text-gray-300 dark:hover:text-[#B9FF66]"
          >
            Sagar Rawat
          </a>
          {" "}&copy; {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
