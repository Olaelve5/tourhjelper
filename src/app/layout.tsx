"use client";

// components/layout.tsx
import React, { ReactNode, useEffect } from 'react';
import Header from '../components/Header' 
import { GlobalLoader } from '../components/GlobalLoader';
import { useLoading } from '../providers/LoadingProvider';
import { CSSTransition } from 'react-transition-group';
import classes from '@/styles/GlobalLoader.module.css';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isLoading } = useLoading();

  useEffect(() => {
    if (!isLoading) {
      document.documentElement.classList.remove('no-scroll');
    }
  }, [isLoading]);

  return (
    <>
      <Header />
      <main style={{marginBottom: 400}}>{children}</main>
      <CSSTransition
        in={isLoading}
        timeout={1000}
        classNames={{
          enter: classes['fade-enter'],
          enterActive: classes['fade-enter-active'],
          exit: classes['fade-exit'],
          exitActive: classes['fade-exit-active'],
        }}
        unmountOnExit
        >
        <GlobalLoader />
      </CSSTransition>
    </>
  );
};

export default Layout;