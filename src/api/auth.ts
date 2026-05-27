import type { AuthResponse, MeResponse, User } from '@/types/auth';
import { apiClient } from './client';

/**
 * Get user identity with Google OAuth token
 * 
 * Flow:
 * 1. Kullanıcı Google'dan token alır
 * 2. React uygulaması GET /api/identity/me'ye token ile istek atar
 * 3. Gateway token'ı doğrular ve backend'e iletir
 * 4. Backend HRClaimsTransformation ile kullanıcıyı veritabanına kaydeder (ilk giriş) veya mevcut kullanıcıyı döndürür
 * 5. Response: { message, internalUserId, userEmail, assignedRole }
 * 
 * @param googleToken - Google OAuth id_token
 * @returns AuthResponse { token: string, user: User }
 * @throws Error if request fails or gateway returns error
 */
export async function loginWithGoogle(googleToken: string): Promise<AuthResponse> {
  try {
    const response = await apiClient.get<MeResponse>(
      '/api/identity/me',
      googleToken
    );
    
    // Transform backend response to AuthResponse format
    const user: User = {
      id: response.internalUserId,
      email: response.userEmail,
      fullName: response.userEmail.split('@')[0], // Use email prefix as fullName for now
      role: response.assignedRole,
      avatarUrl: null,
    };
    
    const authResponse: AuthResponse = {
      token: googleToken, // Use Google token as the auth token
      user,
    };
    
    return authResponse;
  } catch (error) {
    console.error('Google login failed:', error);
    throw error;
  }
}

/**
 * Logout - Clear authentication state on client side
 * 
 * Note: Since Google tokens are stateless, we only need to clear localStorage.
 * The gateway/backend doesn't require explicit logout endpoint call.
 * Token will naturally expire (Google tokens typically expire after 1 hour).
 */
export async function logout(): Promise<void> {
  // Client-side logout: localStorage is managed by AuthContext
  // No backend call needed for stateless Google token-based auth
  await new Promise((resolve) => setTimeout(resolve, 500));
}
