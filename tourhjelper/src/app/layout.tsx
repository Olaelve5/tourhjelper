"use client";
import React, { ReactNode, useEffect } from "react";
import Header from "../components/header/Header";
import { Analytics } from "@vercel/analytics/react";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Analytics />
      <Header />
      <main style={{ marginBottom: 150 }}>{children}</main>
    </>
  );
};

export default Layout;
