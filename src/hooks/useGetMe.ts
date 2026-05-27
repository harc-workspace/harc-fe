import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { useAuth } from './useAuth';
import { useAuthCleanup } from './useAuthCleanup';
import type { MeResponse, User } from '@/types/auth';

/**
 * Hook to validate and fetch user data from the getMe endpoint
 * 
 * This hook:
 * - Reads the google_id_token from context (loaded from localStorage)
 * - Calls GET /api/identity/me with the token
 * - Updates auth context on success
 * - Clears auth and redirects on 401 (token expired)
 * - Only runs if a token exists
 * 
 * Used on app initialization and route changes to validate the persisted token
 */
export function useGetMe() {
  const { token, setUser } = useAuth();
  const { clearAuthAndRedirect } = useAuthCleanup();

  const query = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async (): Promise<User> => {
      if (!token) {
        throw new Error('No token available');
      }

      try {
        const response = await apiClient.get<MeResponse>(
          '/api/identity/me',
          token
        );

        // Transform backend response to User format
        const user: User = {
          id: response.internalUserId,
          email: response.userEmail,
          fullName: response.userEmail.split('@')[0], // Use email prefix as fullName
          role: response.assignedRole,
          avatarUrl: null,
        };

        return user;
      } catch (error) {
        // Check if it's a 401 (unauthorized/expired token)
        if (error instanceof Error && 'status' in error && error.status === 401) {
          // Token is expired or invalid
          await clearAuthAndRedirect();
          throw error;
        }
        // Re-throw other errors
        throw error;
      }
    },
    // Only enable the query if a token exists
    enabled: !!token,
    // Don't retry on 401 - if token is invalid, it won't become valid by retrying
    retry: (count, error) => {
      if (error instanceof Error && 'status' in error && error.status === 401) {
        return false;
      }
      return count < 1; // Retry once for other errors
    },
    // Keep data stale for 5 minutes (matches QueryClient default staleTime)
    staleTime: 5 * 60 * 1000,
  });

  // Update user context when query succeeds
  useEffect(() => {
    if (query.isSuccess && query.data) {
      setUser(query.data);
    }
  }, [query.isSuccess, query.data, setUser]);

  return query;
}
