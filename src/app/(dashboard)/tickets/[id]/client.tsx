"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { StatusBadge, PriorityBadge } from "@/components/ui/status-badge";
import { formatDate, formatCurrency } from "@/lib/utils";
import {
  ArrowLeft, Printer, Clock, User, Paperclip, DollarSign, Trash2, Upload, X, Lock, Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import type { TicketStatus } from "@/types";
import { TICKET_STATUS_LABELS } from "@/types";

const statusOptions = Object.entries(TICKET_STATUS_LABELS).map(([value, label]) => ({ value, label }));

const paymentMethods = [
  { value: "CASH", label: "Cash" },
  { value: "CARD", label: "Card" },
  { value: "UPI", label: "UPI" },
  { value: "BANK_TRANSFER", label: "Bank Transfer" },
  { value: "OTHER", label: "Other" },
];

const paymentStatuses = [
  { value: "UNPAID", label: "Unpaid" },
  { value: "PARTIALLY_PAID", label: "Partially Paid" },
  { value: "PAID", label: "Paid" },
];

export function TicketDetailClient({ ticket: initial, employees }: { ticket: any; employees: any[] }) {
  const router = useRouter();
  const [ticket, setTicket] = useState(initial);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [closeForm, setCloseForm] = useState({
    sameAsEstimated: true,
    finalCost: ticket.estimatedCost || 0,
    paymentMethod: "CASH",
    paymentStatus: "UNPAID",
  });

  const isClosed = ticket.status === "CLOSED";
  const isImage = (mime: string) => ["image/jpeg", "image/png", "image/webp"].includes(mime);

  async function handleStatusChange(status: string) {
    if (status === ticket.status) return;
    if (status === "CLOSED") {
      setShowStatusModal(false);
      setCloseForm({ sameAsEstimated: true, finalCost: ticket.estimatedCost || 0, paymentMethod: "CASH", paymentStatus: "UNPAID" });
      setShowCloseModal(true);
      return;
    }
    setUpdating(true);
    try {
      const res = await fetch(`/api/tickets/${ticket.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
      const d = await res.json();
      if (!d.success) { toast.error(d.error); return; }
      toast.success("Status updated");
      setTicket(d.data);
      setShowStatusModal(false);
      router.refresh();
    } catch { toast.error("Something went wrong"); }
    finally { setUpdating(false); }
  }

  async function handleClose() {
    setUpdating(true);
    try {
      const cost = closeForm.sameAsEstimated ? ticket.estimatedCost : closeForm.finalCost;
      const res = await fetch(`/api/tickets/${ticket.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CLOSED", finalCost: cost, paymentMethod: closeForm.paymentMethod, paymentStatus: closeForm.paymentStatus }) });
      const d = await res.json();
      if (!d.success) { toast.error(d.error); return; }
      toast.success("Ticket closed");
      setTicket(d.data);
      setShowCloseModal(false);
      router.refresh();
    } catch { toast.error("Something went wrong"); }
    finally { setUpdating(false); }
  }

  async function handleDelete() {
    setUpdating(true);
    try {
      const res = await fetch(`/api/tickets/${ticket.id}`, { method: "DELETE" });
      const d = await res.json();
      if (!d.success) { toast.error(d.error); return; }
      toast.success("Ticket deleted");
      router.push("/tickets");
    } catch { toast.error("Something went wrong"); }
    finally { setUpdating(false); }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("ticketId", ticket.id);
    try {
      const res = await fetch("/api/attachments", { method: "POST", body: formData });
      const d = await res.json();
      if (!d.success) { toast.error(d.error); return; }
      toast.success("File uploaded");
      router.refresh();
    } catch { toast.error("Upload failed"); }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = ""; }
  }

  return (
    <div>
      {isClosed && (
        <div className="mb-4 flex items-center gap-2 rounded-2xl bg-[#191A23] px-4 py-3 text-white">
          <Lock className="h-4 w-4" /> This ticket is closed and read-only.
        </div>
      )}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/tickets" className="rounded-2xl p-2 text-[#666] hover:bg-[#F2FFD9]">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#191A23] dark:text-white">{ticket.ticketNumber}</h1>
            <p className="text-sm text-[#666]">{ticket.title}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/print/${ticket.id}`} target="_blank">
            <Button variant="secondary" size="sm"><Printer className="mr-1.5 h-4 w-4" /> Print</Button>
          </Link>
          {!isClosed && (
            <>
              <Button variant="primary" size="sm" onClick={() => setShowStatusModal(true)}>
                <Clock className="mr-1.5 h-4 w-4" /> Change Status
              </Button>
              <Button variant="danger" size="sm" onClick={() => setShowDeleteConfirm(true)}>
                <Trash2 className="mr-1.5 h-4 w-4" /> Delete
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <h2 className="mb-4 text-lg font-semibold text-[#191A23] dark:text-white">Ticket Details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><p className="text-xs font-medium text-[#666]">Status</p><div className="mt-1"><StatusBadge status={ticket.status as TicketStatus} /></div></div>
              <div><p className="text-xs font-medium text-[#666]">Priority</p><div className="mt-1"><PriorityBadge priority={ticket.priority} /></div></div>
              <div><p className="text-xs font-medium text-[#666]">Category</p><p className="text-sm text-[#191A23] dark:text-gray-200">{ticket.category || "—"}</p></div>
              <div><p className="text-xs font-medium text-[#666]">Assigned To</p><p className="text-sm text-[#191A23] dark:text-gray-200">{ticket.assignedTo?.name || "Unassigned"}</p></div>
              <div><p className="text-xs font-medium text-[#666]">Expected Delivery</p><p className="text-sm text-[#191A23]">{ticket.expectedDelivery ? new Date(ticket.expectedDelivery).toLocaleDateString() : "—"}</p></div>
              <div><p className="text-xs font-medium text-[#666]">Created</p><p className="text-sm text-[#191A23]">{formatDate(ticket.createdAt)}</p></div>
              {ticket.closedDate && (
                <div><p className="text-xs font-medium text-[#666]">Closed</p><p className="text-sm text-[#191A23]">{formatDate(ticket.closedDate)} by {ticket.closedBy?.name || "—"}</p></div>
              )}
            </div>
            {ticket.description && <div className="mt-4"><p className="text-xs font-medium text-[#666]">Description</p><p className="mt-1 text-sm text-[#191A23]">{ticket.description}</p></div>}
            {ticket.notes && <div className="mt-4"><p className="text-xs font-medium text-[#666]">Notes</p><p className="mt-1 text-sm text-[#666]">{ticket.notes}</p></div>}
          </Card>

          <Card>
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2"><Paperclip className="h-5 w-5 text-[#B9FF66]" /><h2 className="text-lg font-semibold text-[#191A23] dark:text-white">Attachments</h2></div>
              {!isClosed && (
                <div>
                  <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.webp,.pdf,.docx" className="hidden" onChange={handleFileUpload} />
                  <Button variant="secondary" size="sm" loading={uploading} onClick={() => fileRef.current?.click()}>
                    <Upload className="mr-1.5 h-4 w-4" /> Upload
                  </Button>
                </div>
              )}
            </div>
            {(!ticket.attachments || ticket.attachments.length === 0) ? (
              <p className="py-4 text-center text-sm text-[#666]">No attachments</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {ticket.attachments.map((file: any) => (
                  <a key={file.id} href={file.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-2xl border border-[#D9D9D9] p-3.5 transition-all duration-150 hover:border-[#B9FF66] dark:border-gray-700">
                    {isImage(file.mimeType) ? (
                      <img src={file.url} alt={file.originalName} className="h-10 w-10 rounded-lg object-cover" />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F5F5F5]"><ImageIcon className="h-5 w-5 text-[#999]" /></div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-[#191A23]">{file.originalName}</p>
                      <p className="text-xs text-[#999]">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <div className="mb-5 flex items-center gap-2"><Clock className="h-5 w-5 text-[#B9FF66]" /><h2 className="text-lg font-semibold text-[#191A23] dark:text-white">Timeline</h2></div>
            <div className="space-y-4">
              {(!ticket.timeline || ticket.timeline.length === 0) && <p className="py-4 text-center text-sm text-[#666]">No timeline entries</p>}
              {ticket.timeline?.map((entry: any) => (
                <div key={entry.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-[#B9FF66]" />
                    <div className="h-full w-px bg-[#D9D9D9] dark:bg-gray-700" />
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="text-sm font-medium text-[#191A23] dark:text-white">{entry.action}</p>
                    {entry.details && <p className="text-xs text-[#666]">{entry.details}</p>}
                    <p className="mt-1 text-xs text-[#999]">{formatDate(entry.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <div className="mb-4 flex items-center gap-2"><User className="h-5 w-5 text-[#B9FF66]" /><h2 className="text-lg font-semibold text-[#191A23] dark:text-white">Customer</h2></div>
            <div className="space-y-3">
              <p className="text-sm font-medium text-[#191A23]">{ticket.customer.name}</p>
              <p className="text-sm text-[#666]">{ticket.customer.phone}</p>
              {ticket.customer.email && <p className="text-sm text-[#666]">{ticket.customer.email}</p>}
              {ticket.customer.address && <p className="text-sm text-[#666]">{ticket.customer.address}</p>}
              <Link href={`/customers/${ticket.customer.id}`} className="block text-sm font-medium text-[#B9FF66] hover:text-[#A3F53D]">View Customer Profile →</Link>
            </div>
          </Card>

          <Card>
            <div className="mb-4 flex items-center gap-2"><DollarSign className="h-5 w-5 text-[#B9FF66]" /><h2 className="text-lg font-semibold text-[#191A23] dark:text-white">Payments</h2></div>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-sm text-[#666]">Estimated Cost</span><span className="text-sm font-medium text-[#191A23]">{ticket.estimatedCost ? formatCurrency(ticket.estimatedCost) : "—"}</span></div>
              <div className="flex justify-between"><span className="text-sm text-[#666]">Advance Paid</span><span className="text-sm font-medium text-[#B9FF66]">{ticket.advancePaid ? formatCurrency(ticket.advancePaid) : formatCurrency(0)}</span></div>
              {ticket.finalCost && <div className="flex justify-between"><span className="text-sm text-[#666]">Final Cost</span><span className="text-sm font-bold text-[#191A23]">{formatCurrency(ticket.finalCost)}</span></div>}
              {ticket.paymentStatus && <div className="flex justify-between"><span className="text-sm text-[#666]">Status</span><span className="text-sm font-medium">{ticket.paymentStatus}</span></div>}
              {ticket.paymentMethod && <div className="flex justify-between"><span className="text-sm text-[#666]">Method</span><span className="text-sm font-medium">{ticket.paymentMethod}</span></div>}
              <div className="border-t border-[#D9D9D9] pt-2"><div className="flex justify-between"><span className="text-sm font-medium text-[#191A23]">Remaining</span><span className="text-sm font-bold text-[#191A23]">{ticket.remainingBalance !== null ? formatCurrency(ticket.remainingBalance) : "—"}</span></div></div>
            </div>
          </Card>
        </div>
      </div>

      <Modal open={showStatusModal} onClose={() => setShowStatusModal(false)} title="Change Status">
        <div className="space-y-3">
          <StatusBadge status={ticket.status as TicketStatus} />
          <div className="mt-3 grid grid-cols-2 gap-2">
            {statusOptions.filter(s => s.value !== "CLOSED").map((opt) => (
              <button key={opt.value} disabled={opt.value === ticket.status}
                onClick={() => handleStatusChange(opt.value)}
                className="rounded-2xl border-2 border-[#D9D9D9] px-3 py-2 text-sm font-medium transition-all hover:border-[#B9FF66] disabled:opacity-50">
                {opt.label}
              </button>
            ))}
          </div>
          <div className="pt-2">
            <button onClick={() => handleStatusChange("CLOSED")}
              className="w-full rounded-2xl bg-[#191A23] px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-gray-800">
              Close Ticket
            </button>
          </div>
        </div>
      </Modal>

      <Modal open={showCloseModal} onClose={() => setShowCloseModal(false)} title="Close Ticket">
        <div className="space-y-4">
          <div className="flex items-center gap-2"><label className="text-sm text-[#666]">Estimated Cost:</label><span className="font-bold text-[#191A23]">{ticket.estimatedCost ? formatCurrency(ticket.estimatedCost) : "—"}</span></div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={closeForm.sameAsEstimated} onChange={(e) => setCloseForm({ ...closeForm, sameAsEstimated: e.target.checked })} className="h-4 w-4 accent-[#B9FF66]" />
            <span className="text-sm text-[#191A23]">Same as estimated cost</span>
          </label>
          {!closeForm.sameAsEstimated && (
            <div>
              <label className="mb-1 block text-sm font-medium text-[#191A23]">Final Cost ($)</label>
              <input type="number" step="0.01" value={closeForm.finalCost} onChange={(e) => setCloseForm({ ...closeForm, finalCost: parseFloat(e.target.value) || 0 })}
                className="w-full rounded-2xl border-2 border-[#D9D9D9] px-4 py-2.5 text-sm focus:border-[#B9FF66] focus:outline-none" />
            </div>
          )}
          <div>
            <label className="mb-1 block text-sm font-medium text-[#191A23]">Payment Method</label>
            <select value={closeForm.paymentMethod} onChange={(e) => setCloseForm({ ...closeForm, paymentMethod: e.target.value })}
              className="w-full rounded-2xl border-2 border-[#D9D9D9] px-4 py-2.5 text-sm focus:border-[#B9FF66] focus:outline-none">
              {paymentMethods.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[#191A23]">Payment Status</label>
            <select value={closeForm.paymentStatus} onChange={(e) => setCloseForm({ ...closeForm, paymentStatus: e.target.value })}
              className="w-full rounded-2xl border-2 border-[#D9D9D9] px-4 py-2.5 text-sm focus:border-[#B9FF66] focus:outline-none">
              {paymentStatuses.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowCloseModal(false)}>Cancel</Button>
            <Button loading={updating} onClick={handleClose}>Close Ticket</Button>
          </div>
        </div>
      </Modal>

      <Modal open={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title="Delete Ticket">
        <p className="mb-4 text-sm text-[#666]">Are you sure? This cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
          <Button variant="danger" loading={updating} onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
