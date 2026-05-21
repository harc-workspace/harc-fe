

/**
 * Hook to create auth guards for TanStack Router routes
 * Usage in beforeLoad: createAuthGuard().checkAuth()
 */
export function createAuthGuard() {
  return {
    checkAuth: (user: any, userRole?: string) => {
      if (!user) {
        return false;
      }
      if (userRole && user.role !== userRole) {
        return false;
      }
      return true;
    },
  };
}

/**
 * Loader for protected routes that checks authentication
 * Used in beforeLoad hooks
 */
export function createProtectedRouteLoader(options?: { requiredRole?: string }) {
  return async () => {
    // This loader will be called by TanStack Router
    // The actual auth check happens in the component via useAuth hook
    // But we can return auth status that the route can use
    return { requiresAuth: true, requiredRole: options?.requiredRole };
  };
}
