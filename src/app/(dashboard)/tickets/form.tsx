"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Plus, UserPlus } from "lucide-react";
import toast from "react-hot-toast";

interface TicketFormProps {
  customers: { id: string; name: string; phone: string }[];
  employees: { id: string; name: string }[];
  initialData?: any;
}

export function TicketForm({ customers: initialCustomers, employees, initialData }: TicketFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState(initialCustomers);
  const [showNewCustomer, setShowNewCustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: "", phone: "", email: "" });
  const [creatingCustomer, setCreatingCustomer] = useState(false);
  const [form, setForm] = useState({
    customerId: initialData?.customerId || "",
    title: initialData?.title || "",
    description: initialData?.description || "",
    category: initialData?.category || "",
    priority: initialData?.priority || "MEDIUM",
    expectedDelivery: initialData?.expectedDelivery?.split("T")[0] || "",
    estimatedCost: initialData?.estimatedCost || "",
    advancePaid: initialData?.advancePaid || "0",
    notes: initialData?.notes || "",
    assignedToId: initialData?.assignedToId || "",
  });

  async function handleCreateCustomer(e: React.FormEvent) {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.phone) {
      toast.error("Name and phone are required");
      return;
    }
    setCreatingCustomer(true);
    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCustomer),
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.error || "Failed to create customer");
        return;
      }
      setCustomers((prev) => [...prev, { id: data.data.id, name: data.data.name, phone: data.data.phone }]);
      setForm((prev) => ({ ...prev, customerId: data.data.id }));
      setShowNewCustomer(false);
      setNewCustomer({ name: "", phone: "", email: "" });
      toast.success("Customer created");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setCreatingCustomer(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const body = {
        ...form,
        estimatedCost: form.estimatedCost ? parseFloat(form.estimatedCost) : null,
        advancePaid: form.advancePaid ? parseFloat(form.advancePaid) : 0,
        assignedToId: form.assignedToId || null,
      };

      const url = initialData ? `/api/tickets/${initialData.id}` : "/api/tickets";
      const method = initialData ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.error || "Failed to save ticket");
        return;
      }
      toast.success(initialData ? "Ticket updated" : "Ticket created");
      router.push(`/tickets/${data.data.id}`);
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-[#191A23] dark:text-gray-200">
                Customer *
              </label>
              <div className="flex gap-2">
                <select
                  value={form.customerId}
                  onChange={(e) => setForm({ ...form, customerId: e.target.value })}
                  required
                  className="block w-full rounded-2xl border-2 border-[#D9D9D9] bg-white px-4 py-2.5 text-sm text-[#191A23] transition-all duration-150 focus:border-[#B9FF66] focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                >
                  <option value="">Select a customer</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.phone})
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowNewCustomer(true)}
                  className="flex items-center gap-1.5 rounded-2xl border-2 border-[#D9D9D9] bg-white px-4 py-2.5 text-sm font-medium text-[#191A23] transition-all duration-150 hover:border-[#B9FF66] hover:bg-[#B9FF66]/10 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                >
                  <UserPlus className="h-4 w-4" /> Add
                </button>
              </div>
            </div>

            <div className="sm:col-span-2">
              <Input
                label="Title *"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. iPhone 15 Screen Repair"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-[#191A23] dark:text-gray-200">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="block w-full rounded-2xl border-2 border-[#D9D9D9] bg-white px-4 py-2.5 text-sm text-[#191A23] placeholder:text-[#999] transition-all duration-150 focus:border-[#B9FF66] focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                placeholder="Describe the issue..."
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#191A23] dark:text-gray-200">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="block w-full rounded-2xl border-2 border-[#D9D9D9] bg-white px-4 py-2.5 text-sm text-[#191A23] transition-all duration-150 focus:border-[#B9FF66] focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
              >
                <option value="">Select category</option>
                <option value="Phone Repair">Phone Repair</option>
                <option value="Laptop Repair">Laptop Repair</option>
                <option value="Tablet Repair">Tablet Repair</option>
                <option value="Electronics">Electronics</option>
                <option value="Garage">Garage</option>
                <option value="Appliance">Appliance</option>
                <option value="Tailoring">Tailoring</option>
                <option value="Bakery">Bakery</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#191A23] dark:text-gray-200">
                Priority
              </label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="block w-full rounded-2xl border-2 border-[#D9D9D9] bg-white px-4 py-2.5 text-sm text-[#191A23] transition-all duration-150 focus:border-[#B9FF66] focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>

            <div>
              <Input
                label="Expected Delivery"
                type="date"
                value={form.expectedDelivery}
                onChange={(e) => setForm({ ...form, expectedDelivery: e.target.value })}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#191A23] dark:text-gray-200">
                Assign To
              </label>
              <select
                value={form.assignedToId}
                onChange={(e) => setForm({ ...form, assignedToId: e.target.value })}
                className="block w-full rounded-2xl border-2 border-[#D9D9D9] bg-white px-4 py-2.5 text-sm text-[#191A23] transition-all duration-150 focus:border-[#B9FF66] focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
              >
                <option value="">Unassigned</option>
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Input
                label="Estimated Cost ($)"
                type="number"
                step="0.01"
                min="0"
                value={form.estimatedCost}
                onChange={(e) => setForm({ ...form, estimatedCost: e.target.value })}
              />
            </div>

            <div>
              <Input
                label="Advance Paid ($)"
                type="number"
                step="0.01"
                min="0"
                value={form.advancePaid}
                onChange={(e) => setForm({ ...form, advancePaid: e.target.value })}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-[#191A23] dark:text-gray-200">
                Notes
              </label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={2}
                className="block w-full rounded-2xl border-2 border-[#D9D9D9] bg-white px-4 py-2.5 text-sm text-[#191A23] placeholder:text-[#999] transition-all duration-150 focus:border-[#B9FF66] focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                placeholder="Internal notes..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {initialData ? "Update Ticket" : "Create Ticket"}
            </Button>
          </div>
        </form>
      </Card>

      <Modal
        open={showNewCustomer}
        onClose={() => setShowNewCustomer(false)}
        title="Add New Customer"
      >
        <form onSubmit={handleCreateCustomer} className="space-y-4">
          <Input
            label="Name *"
            value={newCustomer.name}
            onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
            required
          />
          <Input
            label="Phone *"
            value={newCustomer.phone}
            onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            value={newCustomer.email}
            onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
          />
          <div className="flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => setShowNewCustomer(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={creatingCustomer}>
              <Plus className="mr-1 h-4 w-4" /> Add Customer
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
