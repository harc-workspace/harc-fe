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
    onSuccess: (data: AuthResponse) => {
      // NO optimistic update - sunucudan gelen data'yı direkt set et
      setUser(data.user);
      setToken(data.token);
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
