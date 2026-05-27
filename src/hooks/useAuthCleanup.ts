import { useNavigate } from '@tanstack/react-router';
import { useAuth } from './useAuth';

/**
 * Hook to handle auth cleanup and redirect to login
 * Used when authentication fails (e.g., 401 from server)
 */
export function useAuthCleanup() {
  const navigate = useNavigate();
  const { setUser, setToken } = useAuth();

  const clearAuthAndRedirect = async () => {
    // Clear auth state (triggers localStorage cleanup via context)
    setToken(null);
    setUser(null);

    // Redirect to login page
    await navigate({
      to: '/login',
    });
  };

  return { clearAuthAndRedirect };
}
