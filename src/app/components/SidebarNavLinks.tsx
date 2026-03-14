"use client";

import React from "react";
import { Boxes, LayoutGrid, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", name: "Issues", Icon: Boxes },
  { href: "/projects", name: "Projects", Icon: LayoutGrid },
  { href: "/settings", name: "Settings", Icon: Settings },
];

export default function SidebarNavLinks({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  return (
    <ul className="flex flex-col gap-1">
      {links.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/" && pathname?.startsWith(item.href));
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary/20 text-primary"
                  : "text-default-600 hover:bg-default-100 hover:text-foreground"
              }`}
            >
              <item.Icon size={20} strokeWidth={1.5} />
              <span>{item.name}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
