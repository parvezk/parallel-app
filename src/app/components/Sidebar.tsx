"use client";

import React from "react";
import SidebarNavLinks from "@/app/components/SidebarNavLinks";

export default function Sidebar() {
  return (
    <aside className="hidden w-52 shrink-0 border-r border-default-200/50 bg-background/95 md:block">
      <nav className="sticky top-0 flex flex-col gap-2 p-3">
        <SidebarNavLinks />
      </nav>
    </aside>
  );
}
