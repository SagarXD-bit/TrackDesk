import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { TicketDetailClient } from "./client";

export const dynamic = "force-dynamic";

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: {
      customer: true,
      assignedTo: { select: { id: true, name: true, email: true } },
      timeline: { orderBy: { createdAt: "desc" } },
      attachments: true,
    },
  });

  if (!ticket) notFound();

  const employees = await prisma.user.findMany({
    where: { active: true },
    select: { id: true, name: true, email: true },
  });

  return (
    <TicketDetailClient
      ticket={JSON.parse(JSON.stringify(ticket))}
      employees={JSON.parse(JSON.stringify(employees))}
    />
  );
}
