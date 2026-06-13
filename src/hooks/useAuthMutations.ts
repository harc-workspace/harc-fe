import { useMutation } from '@tanstack/react-query';
import { loginWithGoogle, logout } from '@/api/auth';
import { useAuth } from './useAuth';
import type { AuthResponse } from '@/types/auth';

export function useLoginMutation() {
  const { setUser, setToken } = useAuth();

  return useMutation({
    mutationFn: async (googleCredential: string) => {
      return await loginWithGoogle(googleCredential);
    },
    onSuccess: (data: AuthResponse, googleCredential: string) => {
      // Store the Google credential (not the JWT response)
      // This is the persistent credential that will be used to call getMe on future sessions
      setToken(googleCredential);
      
      // Update user data from server response
      setUser(data.user);
    },
  });
}


export function useLogoutMutation() {
  const { setUser, setToken } = useAuth();

  return useMutation({
    mutationFn: async () => {
      return await logout();
    },
    onSuccess: () => {
      // Clear auth state
      setUser(null);
      setToken(null);
    },
  });
}
