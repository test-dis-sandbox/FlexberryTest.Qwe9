'use client';
import 'primereact/resources/themes/lara-light-blue/theme.css';

import React, { useEffect } from 'react';
import { useState, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CssBaseline, useMediaQuery, useTheme } from '@mui/material';

import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import AppTheme from '@/theme/AppTheme';
import { NotificationProvider } from '@/components/Notification';

import { MainContent } from './styles';
import '@/utils/setupDayjs';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mounted, setMounted] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      }),
    []
  );

  const handleHeaderNavigationOpen = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  return (
    <QueryClientProvider client={queryClient}>
      <AppTheme>
        <CssBaseline />
        {mounted && (
          <NotificationProvider>
            <Header onNavigationClick={handleHeaderNavigationOpen} />
            <MainContent sidebarOpen={sidebarOpen}>
              <Sidebar open={sidebarOpen} />
              {children}
            </MainContent>
          </NotificationProvider>
        )}
      </AppTheme>
    </QueryClientProvider>
  );
}
