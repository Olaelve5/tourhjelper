"use client";

// components/layout.tsx
import React, { ReactNode, useEffect } from "react";
import Header from "../components/header/Header";
import { useLoading } from "../providers/LoadingProvider";
import { Analytics } from "@vercel/analytics/react";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isLoading } = useLoading();

  useEffect(() => {
    if (!isLoading) {
      document.documentElement.classList.remove("no-scroll");
    }
  }, [isLoading]);

  return (
    <>
      <Analytics />
      <Header />
      <main style={{ marginBottom: 150 }}>{children}</main>
    </>
  );
};

export default Layout;
