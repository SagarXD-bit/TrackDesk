import { ClipboardCheck } from "lucide-react";

export function Logo({ size = "default" }: { size?: "sm" | "default" | "lg" }) {
  const iconSize = size === "sm" ? "h-5 w-5" : size === "lg" ? "h-9 w-9" : "h-7 w-7";
  const textSize = size === "sm" ? "text-sm" : size === "lg" ? "text-2xl" : "text-xl";

  return (
    <div className="flex items-center gap-2.5">
      <div className="flex items-center justify-center rounded-xl bg-[#B9FF66] p-1.5 text-[#191A23]">
        <ClipboardCheck className={iconSize} />
      </div>
      <span className={`${textSize} font-bold text-white`}>Track Desk</span>
    </div>
  );
}
