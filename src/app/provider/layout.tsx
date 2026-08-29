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
    <div className="min-h-screen bg-background">
      <Sidebar role={session.role} userName={session.name || session.email} userRole={formattedRole} />
      <DashboardHeader userName={session.name || session.email} userRole={formattedRole} />
      <main className="lg:pl-64 pt-0">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
