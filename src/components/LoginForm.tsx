'use client';

import type { CredentialResponse } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import { useLoginMutation } from '@/hooks/useAuthMutations';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from '@tanstack/react-router';

export function LoginForm() {
  const { isLoading } = useAuth();
  const loginMutation = useLoginMutation();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      return;
    }

    try {
      // Send Google JWT token to backend
      await loginMutation.mutateAsync(credentialResponse.credential);

      // Login başarılı olursa dashboard'a yönlendir
      navigate({ to: '/dashboard' });
    } catch (error) {
      console.error('Login error:', error);
      // Hata handling - mutation.error'da gösterilir
    }
  };

  const handleGoogleError = () => {
    console.error('Google login failed');
  };

  return (
    <div className="flex flex-col gap-4">
      {loginMutation.error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded border border-red-200">
          {loginMutation.error instanceof Error
            ? loginMutation.error.message
            : 'Login failed. Please try again.'}
        </div>
      )}

      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          text="signin_with"
          size="large"
        />
      </div>

      {isLoading && (
        <div className="text-center text-sm text-gray-600">
          Authenticating...
        </div>
      )}
    </div>
  );
}
