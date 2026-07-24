import { Badge } from "./badge";
import { TICKET_STATUS_LABELS, STATUS_COLORS, PRIORITY_LABELS, PRIORITY_COLORS } from "@/types";
import type { TicketStatus, Priority } from "@/types";

export function StatusBadge({ status }: { status: TicketStatus }) {
  return (
    <Badge className={STATUS_COLORS[status]}>
      {TICKET_STATUS_LABELS[status]}
    </Badge>
  );
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <Badge className={PRIORITY_COLORS[priority]}>
      {PRIORITY_LABELS[priority]}
    </Badge>
  );
}
