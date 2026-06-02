"use client";

import Sidebar from "@/components/Sidebar";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <div className="main-layout">
      <Sidebar />
      <div className="content-area">
        <main key={pathname} className="page-body animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
