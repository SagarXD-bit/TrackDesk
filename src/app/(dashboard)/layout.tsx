import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SidebarProvider } from "@/components/layout/sidebar-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex flex-1 flex-col min-w-0">
          <Navbar />
          <main className="flex-1 overflow-y-auto bg-[#F5F5F5] p-4 sm:p-6 dark:bg-gray-900">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
}
