"use client";
import React, { ReactNode, useEffect } from "react";
import Header from "../components/header/Header";
import { Analytics } from "@vercel/analytics/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface LayoutProps {
  children: ReactNode;
}

const queryClient = new QueryClient();

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Analytics />
      <Header />
      <main style={{ marginBottom: 150, marginTop: 100 }}>{children}</main>
    </QueryClientProvider>
  );
};

export default Layout;
