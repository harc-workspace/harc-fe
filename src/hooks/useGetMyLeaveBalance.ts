import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { useAuth } from './useAuth';

export interface LeaveBalanceResponse {
  totalLeaveQuota: number;
  usedLeaveDays: number;
  remainingLeaveDays: number;
  nextAnniversaryDate: string;
  daysUntilNextAnniversary: number;
  nextAllowanceAmount: number;
}

export function useGetMyLeaveBalance() {
  const { token } = useAuth();

  return useQuery({
    queryKey: ['leave', 'my-balance'],
    queryFn: async () => {
      if (!token) throw new Error('No token available');
      return await apiClient.get<LeaveBalanceResponse>('/api/leave/my-balance', token);
    },
    enabled: !!token,
    staleTime: 60 * 60 * 1000, // 1h cache time
  });
}