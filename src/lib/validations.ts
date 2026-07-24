import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(2),
  password: z.string().min(6),
  role: z.enum(["ADMIN", "EMPLOYEE"]).optional(),
});

export const customerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
});

export const ticketSchema = z.object({
  customerId: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional().or(z.literal("")),
  category: z.string().optional().or(z.literal("")),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  expectedDelivery: z.string().optional().or(z.literal("")),
  estimatedCost: z.number().optional().nullable(),
  advancePaid: z.number().optional().nullable(),
  notes: z.string().optional().or(z.literal("")),
  assignedToId: z.string().optional().nullable(),
});

export const ticketUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  status: z.enum([
    "RECEIVED", "DIAGNOSING", "WAITING_APPROVAL", "WAITING_PARTS",
    "REPAIR_IN_PROGRESS", "QUALITY_CHECK", "READY_FOR_PICKUP",
    "DELIVERED", "CANCELLED", "CLOSED",
  ]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  expectedDelivery: z.string().optional().nullable(),
  estimatedCost: z.number().optional().nullable(),
  advancePaid: z.number().optional().nullable(),
  remainingBalance: z.number().optional().nullable(),
  finalCost: z.number().optional().nullable(),
  paymentStatus: z.enum(["UNPAID", "PARTIALLY_PAID", "PAID"]).optional(),
  paymentMethod: z.enum(["CASH", "CARD", "UPI", "BANK_TRANSFER", "OTHER"]).optional().nullable(),
  notes: z.string().optional(),
  assignedToId: z.string().optional().nullable(),
});
