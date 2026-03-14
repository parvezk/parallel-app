"use client";

import React, { useState, useEffect } from "react";
import Providers from "./providers";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? <Providers>{children}</Providers> : <></>;
}
