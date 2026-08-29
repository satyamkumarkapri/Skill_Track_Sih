import React from "react";
import { Sidebar, DashboardHeader } from "@/components/navigation";
import { verifySession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function ProviderLayout({ children }: { children: React.ReactNode }) {
  const session = await verifySession();
  
  if (!session) {
    redirect("/login");
  }

  const formattedRole = session.role
    ? session.role.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : "Provider";

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden flex flex-col">
      {/* Subtle, soft animated mesh background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/10 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse-subtle"></div>
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-purple-400/10 rounded-full mix-blend-multiply filter blur-[120px] animate-pulse-subtle" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[60%] bg-emerald-400/10 rounded-full mix-blend-multiply filter blur-[130px] animate-pulse-subtle" style={{ animationDelay: '4s' }}></div>
      </div>

      <Sidebar role={session.role} userName={session.name || session.email} userRole={formattedRole} />
      
      <div className="flex-1 flex flex-col lg:pl-64 relative z-10">
        <DashboardHeader userName={session.name || session.email} userRole={formattedRole} />
        <main className="flex-1 p-6 animate-fade-in-up">
          {children}
        </main>
      </div>
    </div>
  );
}
