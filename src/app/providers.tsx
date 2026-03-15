"use client";

import React from "react";
import GQLProvider from "@/app/gqlProvider";
import { UserProvider } from "@/app/context/UserContext";
import { HeroUIProvider } from "@heroui/react";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <HeroUIProvider>
      <GQLProvider>
        <UserProvider>{children}</UserProvider>
      </GQLProvider>
    </HeroUIProvider>
  );
};

export default Providers;
