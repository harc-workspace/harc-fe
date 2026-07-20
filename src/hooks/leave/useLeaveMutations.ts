import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createLeaveRequest, type CreateLeaveRequest } from '../../api/leave';
import { toast } from 'sonner';
import { useAuth } from '../useAuth';

export const useCreateLeave = () => {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  return useMutation({
    mutationFn: (data: CreateLeaveRequest) => createLeaveRequest(data, token),
    onSuccess: () => {
      toast.success('İzin talebiniz başarıyla oluşturuldu.');
      // İzin bakiyesini veya geçmişini güncelleyen query'leri yenileyin
      queryClient.invalidateQueries({ 
        queryKey: ['leave', 'my-balance'] 
      });
    },
    onError: (error) => {
      toast.error('İzin talebi oluşturulurken bir hata meydana geldi.');
      console.error('Leave creation error:', error);
    },
  });
};