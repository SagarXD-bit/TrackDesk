import { ClipboardCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="shrink-0 border-t border-white/[0.04] bg-[#050505] px-4 py-4 sm:px-6">
      <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center rounded-lg bg-[#B9FF66] p-1 text-[#0A0A0A]">
            <ClipboardCheck className="h-4 w-4" />
          </div>
          <span className="text-sm font-bold text-white/60">Track Desk</span>
        </div>
        <p className="text-xs text-white/30">
          Built by{" "}
          <a href="https://sagar-rawat.vercel.app/" target="_blank" rel="noopener noreferrer"
            className="font-medium text-white/50 underline underline-offset-2 transition-colors hover:text-[#B9FF66]">
            Sagar Rawat
          </a>
          {" "}&copy; {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
