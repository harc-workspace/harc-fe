import { Outlet } from '@tanstack/react-router';
import { useGetMe } from '@/hooks/useGetMe';
import { useAuth } from '@/hooks/useAuth';

/**
 * App initialization component
 * 
 * This component:
 * - Validates the persisted google_id_token on app load (if one exists)
 * - Blocks rendering until token validation completes
 * - Shows loading state during validation
 * - Automatically redirects on token expiration (401)
 * 
 * Wraps the entire route tree to ensure auth is validated before rendering any protected routes
 */
export function AppInit() {
  const { token } = useAuth();
  const { isLoading, isError, isPending } = useGetMe();

  // If there's a token, validate it (useGetMe is running)
  if (token && (isLoading || isPending)) {
    // Show loading state while validating token
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4" />
          <p className="text-gray-600">Validating session...</p>
        </div>
      </div>
    );
  }

  // If there's a token and validation failed, cleanup is handled by useGetMe hook
  // Don't render anything while redirect is happening
  if (token && isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600">Redirecting to login...</p>
      </div>
    );
  }

  // No token or validation succeeded - render app normally
  return <Outlet />;
}
