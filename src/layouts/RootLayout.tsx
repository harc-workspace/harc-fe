'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext.tsx';
import { AppInit } from '@/components/AppInit';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Toaster } from '@/components/ui/sonner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

export function RootLayout() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="system" storageKey="harc-theme">
          <div className="relative min-h-screen">
            <AppInit />
            <Toaster richColors position="top-center"
              toastOptions={{
                classNames: {
                  error: "group-[.toaster]:dark:!bg-red-950 group-[.toaster]:dark:!text-red-400 group-[.toaster]:dark:!border-red-900/50",
                  success: "group-[.toaster]:dark:!bg-emerald-950 group-[.toaster]:dark:!text-emerald-400 group-[.toaster]:dark:!border-emerald-900/50",
                  info: "group-[.toaster]:dark:!bg-blue-950 group-[.toaster]:dark:!text-blue-400 group-[.toaster]:dark:!border-blue-900/50",
                }
              }}
            />
          </div>
        </ThemeProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}