import { useMutation } from '@tanstack/react-query';
import { loginWithGoogle, logout } from '@/api/auth';
import { useAuth } from './useAuth';
import type { AuthResponse } from '@/types/auth';

export function useLoginMutation() {
  const { setUser, setToken, setIsLoading } = useAuth();

  return useMutation({
    mutationFn: async (googleCredential: string) => {
      return await loginWithGoogle(googleCredential);
    },
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: (data: AuthResponse, googleCredential: string) => {
      // Store the Google credential (not the JWT response)
      // This is the persistent credential that will be used to call getMe on future sessions
      setToken(googleCredential);
      
      // Update user data from server response
      setUser(data.user);
      setIsLoading(false);
    },
    onError: () => {
      setIsLoading(false);
    },
  });
}


export function useLogoutMutation() {
  const { setUser, setToken, setIsLoading } = useAuth();

  return useMutation({
    mutationFn: async () => {
      return await logout();
    },
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: () => {
      // Clear auth state
      setUser(null);
      setToken(null);
      setIsLoading(false);
    },
    onError: () => {
      setIsLoading(false);
    },
  });
}
