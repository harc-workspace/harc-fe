import type { LeaveType } from '@/enums/leaveType';
import { apiClient } from './client';
import { useAuth } from '@/hooks/useAuth';

export interface CreateLeaveRequest {
  StartDate: string;
  EndDate: string;
  LeaveType: LeaveType;
  Description?: string | null;
  Documents?: File[];
}

export const createLeaveRequest = async (data: CreateLeaveRequest, token: string) => {
    
    const formData = new FormData();

    // .NET backend modelindeki property isimleriyle eşleştiriyoruz
    formData.append('StartDate', data.StartDate);
    formData.append('EndDate', data.EndDate);
    formData.append('LeaveType', data.LeaveType.toString());
    formData.append('Description', data.Description ?? '');

    // List<IFormFile> için aynı key ('Documents') ile birden fazla append yapmalıyız
    if (data.Documents && data.Documents.length > 0) {
    data.Documents.forEach((file) => {
        formData.append('Documents', file);
    });
    }

    // İstek atıyoruz, client FormData için Content-Type header'ını kendisi ayarlıyor.
    const response = await apiClient.post('/api/leave', formData, token);
    return response.data;
};