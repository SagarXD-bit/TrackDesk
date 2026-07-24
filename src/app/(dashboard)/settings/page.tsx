import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Users, Settings as SettingsIcon } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true, active: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#191A23] dark:text-white">Settings</h1>
        <p className="text-sm text-[#666] dark:text-gray-400">Manage your system settings</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <div className="mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-[#B9FF66]" />
              <h2 className="text-lg font-semibold text-[#191A23] dark:text-white">Users</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#D9D9D9] dark:border-gray-700">
                    <th className="px-4 py-3 font-medium text-[#666]">Name</th>
                    <th className="px-4 py-3 font-medium text-[#666]">Email</th>
                    <th className="px-4 py-3 font-medium text-[#666]">Role</th>
                    <th className="px-4 py-3 font-medium text-[#666]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D9D9D9] dark:divide-gray-700">
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td className="px-4 py-3 font-medium text-[#191A23] dark:text-white">{u.name}</td>
                      <td className="px-4 py-3 text-[#666]">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          u.role === "ADMIN" ? "bg-[#B9FF66] text-[#191A23]" : "bg-gray-200 text-gray-700"
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          u.active ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
                        }`}>
                          {u.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div>
          <Card>
            <div className="mb-4 flex items-center gap-2">
              <SettingsIcon className="h-5 w-5 text-[#B9FF66]" />
              <h2 className="text-lg font-semibold text-[#191A23] dark:text-white">Quick Actions</h2>
            </div>
            <div className="space-y-3">
              <p className="text-sm text-[#666]">Use the terminal to manage users, run Prisma migrations, and seed data.</p>
              <code className="block rounded-2xl bg-[#F5F5F5] p-2.5 text-xs dark:bg-gray-700">npx prisma db push</code>
              <code className="block rounded-2xl bg-[#F5F5F5] p-2.5 text-xs dark:bg-gray-700">npx prisma studio</code>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
