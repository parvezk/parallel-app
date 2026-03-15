"use client";

import React, { useEffect } from "react";
import { isAuth } from "@/utils/token";
import { redirect } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";
import TopBar from "@/app/components/TopBar";

const DashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  useEffect(() => {
    if (!isAuth()) {
      redirect("/signin");
    }
  }, []);

  return (
    <div
      className="flex h-screen w-full flex-col bg-background"
      suppressHydrationWarning
    >
      <TopBar />
      <section className="flex min-h-0 flex-1">
        <Sidebar />
        <main className="min-w-0 flex-1 overflow-auto">{children}</main>
      </section>
    </div>
  );
};

export default DashboardLayout;
