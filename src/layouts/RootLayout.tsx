'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext.tsx';
import { AppInit } from '@/components/AppInit';
import { LanguageProvider } from '@/contexts/LanguageContext';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export function RootLayout() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <div className="relative min-h-screen">
            <AppInit />
          </div>
        </LanguageProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}
