import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center rounded-2xl font-medium transition-all duration-150 focus:outline-none disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-[#B9FF66] text-[#191A23] hover:bg-[#A3F53D] active:scale-[1.02]": variant === "primary",
            "border-2 border-[#D9D9D9] bg-white text-[#191A23] hover:border-[#B9FF66] hover:shadow-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100":
              variant === "secondary",
            "bg-red-500 text-white hover:bg-red-600 active:scale-[1.02]": variant === "danger",
            "text-[#666] hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800": variant === "ghost",
          },
          {
            "h-9 px-4 text-sm": size === "sm",
            "h-11 px-5 text-sm": size === "md",
            "h-13 px-7 text-base": size === "lg",
          },
          className
        )}
        {...props}
      >
        {loading && (
          <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
