import type { AuthResponse, User } from '@/types/auth';

/**
 * Mock Google OAuth login
 * Backend ready olunca: POST /api/auth/google ile değiştirilecek
 * Backend response formatı: { token: string, user: User }
 */
export async function loginWithGoogle(_googleCredential: string): Promise<AuthResponse> {
  // TODO: Backend Google OAuth endpoint'ine bağlan
  // const response = await fetch(`${API_BASE_URL}/auth/google`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ credential: googleCredential }),
  // });
  // return response.json();

  // Mock response - backend hazırlanırken test için
  const mockUser: User = {
    id: 'mock-user-123',
    email: 'user@workspace.google.com',
    fullName: 'Mock User',
    role: 'Employee',
    avatarUrl: 'https://lh3.googleusercontent.com/a/default-user',
  };

  const mockToken = 'mock-jwt-token-' + Date.now();

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    token: mockToken,
    user: mockUser,
  };
}

/**
 * Logout - server-side işlemi temizle
 * Backend ready olunca: POST /api/auth/logout
 */
export async function logout(): Promise<void> {
  // TODO: Backend logout endpoint'ine bağlan
  // const response = await fetch(`${API_BASE_URL}/auth/logout`, {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${token}`,
  //   },
  // });

  // Mock logout
  await new Promise((resolve) => setTimeout(resolve, 500));
}
