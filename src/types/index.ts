import type {
  User, Customer, Ticket, Timeline, Attachment,
  TicketStatus, Priority, UserRole, PaymentStatus, PaymentMethod, Notification,
} from "@prisma/client";

export type {
  User, Customer, Ticket, Timeline, Attachment,
  TicketStatus, Priority, UserRole, PaymentStatus, PaymentMethod, Notification,
};

export type TicketWithRelations = Ticket & {
  customer: Customer;
  assignedTo: Pick<User, "id" | "name" | "email"> | null;
  closedBy?: Pick<User, "id" | "name"> | null;
  timeline?: Timeline[];
  attachments?: Attachment[];
};

export type CustomerWithTickets = Customer & {
  tickets: TicketWithRelations[];
};

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface DashboardStats {
  totalTickets: number;
  openTickets: number;
  readyForPickup: number;
  deliveredTickets: number;
  cancelledTickets: number;
  monthlyRevenue: number;
  todayTickets: number;
  activeCustomers: number;
  recentTickets: TicketWithRelations[];
  statusDistribution: { status: string; _count: number }[];
  weeklyData: { name: string; tickets: number }[];
}

export const TICKET_STATUS_LABELS: Record<TicketStatus, string> = {
  RECEIVED: "Received",
  DIAGNOSING: "Diagnosing",
  WAITING_APPROVAL: "Waiting for Approval",
  WAITING_PARTS: "Waiting for Parts",
  REPAIR_IN_PROGRESS: "Repair in Progress",
  QUALITY_CHECK: "Quality Check",
  READY_FOR_PICKUP: "Ready for Pickup",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  CLOSED: "Closed",
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  LOW: "Low", MEDIUM: "Medium", HIGH: "High", URGENT: "Urgent",
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  UNPAID: "Unpaid",
  PARTIALLY_PAID: "Partially Paid",
  PAID: "Paid",
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  CASH: "Cash",
  CARD: "Card",
  UPI: "UPI",
  BANK_TRANSFER: "Bank Transfer",
  OTHER: "Other",
};

export const STATUS_COLORS: Record<TicketStatus, string> = {
  RECEIVED: "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
  DIAGNOSING: "bg-purple-200 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  WAITING_APPROVAL: "bg-amber-200 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  WAITING_PARTS: "bg-orange-200 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  REPAIR_IN_PROGRESS: "bg-[#B9FF66] text-[#191A23]",
  QUALITY_CHECK: "bg-cyan-200 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
  READY_FOR_PICKUP: "bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200",
  DELIVERED: "bg-emerald-200 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
  CANCELLED: "bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200",
  CLOSED: "bg-[#191A23] text-white",
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  LOW: "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
  MEDIUM: "bg-[#B9FF66] text-[#191A23]",
  HIGH: "bg-orange-200 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  URGENT: "bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200",
};
