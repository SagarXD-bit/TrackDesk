import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SidebarProvider } from "@/components/layout/sidebar-context";
import { AuroraBg } from "@/components/layout/aurora-bg";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-[#050505]">
        <AuroraBg />
        <Sidebar />
        <div className="relative z-10 flex flex-1 flex-col min-w-0">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
}
