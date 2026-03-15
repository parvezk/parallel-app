"use client";

import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "urql";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Menu } from "lucide-react";

import { useUserContext } from "@/app/context/UserContext";
import { USERS_QUERY } from "@/gql/USERS_QUERY";
import { removeToken } from "@/utils/token";
import Logo from "@/app/components/Logo";
import SidebarNavLinks from "@/app/components/SidebarNavLinks";
import { Button, Drawer, DrawerContent } from "@heroui/react";

const TopBar = () => {
  const { setUser } = useUserContext();
  const previousUserRef = useRef<unknown>(null);
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [{ data, fetching, error }] = useQuery({
    query: USERS_QUERY,
  });

  useEffect(() => {
    if (data?.user && data.user !== previousUserRef.current) {
      setUser(data.user);
      previousUserRef.current = data.user;
    }
  }, [data, setUser]);

  const handleLogout = () => {
    removeToken();
    setUser(null);
    router.push("/signin");
  };

  const logoBlock = (
    <Link href="/" className="flex items-center gap-2 no-underline">
      <Logo size={28} className="text-primary" />
      <span className="font-heading text-lg font-semibold text-foreground">
        Parallel
      </span>
    </Link>
  );

  if (fetching) {
    return (
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-default-200/50 bg-background px-4">
        <div className="flex items-center gap-2">
          {logoBlock}
        </div>
        <div className="text-sm text-default-500">Loading...</div>
      </header>
    );
  }
  if (error) {
    return (
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-default-200/50 bg-background px-4">
        <div className="flex items-center gap-2">{logoBlock}</div>
        <div className="text-sm text-danger">Error</div>
      </header>
    );
  }

  return (
    <>
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-default-200/50 bg-background px-4">
        <div className="flex items-center gap-2">
          <Button
            isIconOnly
            variant="flat"
            size="sm"
            className="md:hidden"
            aria-label="Open menu"
            onPress={() => setMobileMenuOpen(true)}
          >
            <Menu size={20} />
          </Button>
          {logoBlock}
        </div>
        <div className="flex items-center gap-3">
          <span className="max-w-[140px] truncate text-sm text-default-500 sm:max-w-[200px]">
            {data?.user?.email}
          </span>
          <Button size="sm" variant="flat" color="primary" onPress={handleLogout}>
            Logout
          </Button>
        </div>
      </header>
      <Drawer
        isOpen={mobileMenuOpen}
        onOpenChange={setMobileMenuOpen}
        placement="left"
      >
        <DrawerContent>
          <div className="flex h-full w-64 flex-col gap-2 p-4">
            <div className="flex items-center justify-between border-b border-default-200 pb-3">
              <span className="font-heading font-semibold">Menu</span>
              <Button
                size="sm"
                variant="light"
                onPress={() => setMobileMenuOpen(false)}
              >
                Close
              </Button>
            </div>
            <SidebarNavLinks onNavigate={() => setMobileMenuOpen(false)} />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default TopBar;
