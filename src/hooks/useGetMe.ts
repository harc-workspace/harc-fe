import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { useAuth } from './useAuth';
import type { MeResponse, User } from '@/types/auth';

export function useGetMe() {
  const navigate = useNavigate();
  const { token, setUser, setToken } = useAuth();

  const query = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async (): Promise<User> => {
      if (!token) {
        throw new Error('No token available');
      }

      try {
        const response = await apiClient.get<MeResponse>('/api/identity/me', token);

        // Backend'den gelen tüm yeni alanları frontend User formatına eşliyoruz
        const user: User = {
          id: response.internalUserId,
          email: response.userEmail,
          fullName: response.userEmail.split('@')[0], // İsterseniz backend'den isim alanı eklenene kadar kalabilir
          role: response.assignedRole,
          roleDisplayName: response.assignedRoleDisplayName,
          avatarUrl: response.avatar,
          team: response.team,
          title: response.title,
          manager: response.manager,
        };

        return user;
      } catch (error) {
        // Whitelist'te olmayan veya silinen kullanıcılar 401 hatası aldığında otomatik temizlenip login'e atılır
        if (error instanceof Error && 'status' in error && error.status === 401) {
          setToken(null);
          setUser(null);
          await navigate({ to: '/login' });
          throw error;
        }
        throw error;
      }
    },
    enabled: !!token,
    retry: (count, error) => {
      if (error instanceof Error && 'status' in error && error.status === 401) {
        return false;
      }
      return count < 1;
    },
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      setUser(query.data);
    }
  }, [query.isSuccess, query.data, setUser]);

  return query;
}