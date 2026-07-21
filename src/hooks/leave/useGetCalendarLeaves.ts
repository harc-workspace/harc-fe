import { useQuery } from '@tanstack/react-query';
import { getCalendarLeaves } from '../../api/leave';
import { useAuth } from '../useAuth';

export function useGetCalendarLeaves(year: number, month: number) {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: ['leave', 'calendar', year, month],
    queryFn: async () => {
      if (!token) throw new Error('No token available');
      return await getCalendarLeaves(year, month, token);
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });
}