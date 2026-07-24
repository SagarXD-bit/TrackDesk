import { prisma } from "@/lib/prisma";
import { CustomersClient } from "./client";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ search?: string; page?: string }>;
}

export default async function CustomersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1"));
  const pageSize = 10;

  const where: Record<string, unknown> = {};
  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { phone: { contains: params.search } },
      { email: { contains: params.search, mode: "insensitive" } },
    ];
  }

  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { tickets: true } } },
    }),
    prisma.customer.count({ where }),
  ]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Customers</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {total} total customer{total !== 1 ? "s" : ""}
          </p>
        </div>
        <a
          href="/customers/new"
          className="inline-flex items-center rounded-lg gradient-bg px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          Add Customer
        </a>
      </div>
      <CustomersClient
        customers={JSON.parse(JSON.stringify(customers))}
        total={total}
        page={page}
        pageSize={pageSize}
      />
    </div>
  );
}
