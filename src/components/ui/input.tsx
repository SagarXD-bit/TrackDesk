import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-[#191A23] dark:text-gray-200">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "block w-full rounded-2xl border-2 border-[#D9D9D9] bg-white px-4 py-2.5 text-sm text-[#191A23] shadow-sm placeholder:text-[#999] transition-all duration-150",
            "focus:border-[#B9FF66] focus:outline-none focus:ring-0",
            "dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100",
            error && "border-red-400 focus:border-red-500",
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
