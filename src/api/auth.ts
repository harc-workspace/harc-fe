import type { AuthResponse, MeResponse, User } from '@/types/auth';
import { apiClient } from './client';

export async function loginWithGoogle(googleToken: string): Promise<AuthResponse> {
  try {
    const response = await apiClient.get<MeResponse>(
      '/api/identity/me',
      googleToken
    );
    
    const user: User = {
      id: response.internalUserId,
      email: response.userEmail,
      fullName: response.userEmail.split('@')[0],
      role: response.assignedRole,
      roleDisplayName: response.assignedRoleDisplayName,
      avatarUrl: response.avatar,
      team: response.team,
      title: response.title,
      manager: response.manager,
    };
    
    const authResponse: AuthResponse = {
      token: googleToken,
      user,
    };
    
    return authResponse;
  } catch (error) {
    console.error('Google login failed:', error);
    throw error;
  }
}

export async function logout(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500));
}