'use client';

import { useActionState } from 'react';
import { useLoginMutation } from '@/hooks/useAuthMutations';
import { useAuth } from '@/hooks/useAuth';

async function loginAction(
  _prevState: { error?: string } | null,
  formData: FormData
) {
  // Form'dan credential al
  const credential = formData.get('googleCredential') as string;

  if (!credential) {
    return { error: 'Google credential is required' };
  }

  return { success: true, credential };
}

export function LoginForm() {
  const { isLoading } = useAuth();
  const loginMutation = useLoginMutation();
  const [state, formAction] = useActionState(loginAction, null);

  const isSubmitting = isLoading || loginMutation.isPending;

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {/* Hidden input for Google credential */}
      <input
        type="hidden"
        name="googleCredential"
        defaultValue="mock-google-credential"
        id="googleCredential"
      />

      {state?.error && (
        <div className="text-red-600 text-sm">{state.error}</div>
      )}

      {loginMutation.error && (
        <div className="text-red-600 text-sm">
          Login failed: {loginMutation.error.message}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Logging in...' : 'Login with Google'}
      </button>
    </form>
  );
}
