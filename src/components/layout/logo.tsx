import { ClipboardCheck } from "lucide-react";

export function Logo({ collapsed = false }: { collapsed?: boolean }) {
  if (collapsed) {
    return (
      <div className="flex items-center justify-center w-full">
        <div className="flex items-center justify-center rounded-xl w-9 h-9 bg-gradient-to-br from-[#B9FF66] to-[#8BE63D] shadow-lg shadow-[#B9FF66]/20">
          <ClipboardCheck className="h-5 w-5 text-[#0A0A0A]" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center rounded-xl w-9 h-9 bg-gradient-to-br from-[#B9FF66] to-[#8BE63D] shadow-lg shadow-[#B9FF66]/20 shrink-0">
          <ClipboardCheck className="h-5 w-5 text-[#0A0A0A]" />
        </div>
        <div className="flex flex-col">
          <span className="text-base font-bold leading-tight text-white tracking-tight">
            Track Desk
          </span>
          <span className="text-[11px] font-normal text-white/40 leading-tight">
            Ticket Management
          </span>
        </div>
      </div>
    </div>
  );
}
