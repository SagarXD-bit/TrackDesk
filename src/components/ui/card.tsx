import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[20px] border border-[#D9D9D9] bg-white p-6 shadow-sm transition-shadow duration-150 hover:shadow-md dark:border-gray-700 dark:bg-gray-800",
        className
      )}
    >
      {children}
    </div>
  );
}
