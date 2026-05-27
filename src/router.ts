import { createRouter, RootRoute, Route, redirect } from '@tanstack/react-router';
import { RootLayout } from '@/layouts/RootLayout';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

/**
 * Helper to get current auth state from localStorage
 * Used in beforeLoad hooks to check authentication
 */
function getStoredAuthState() {
  try {
    const token = localStorage.getItem('google_id_token');
    const userJson = localStorage.getItem('auth_user');
    const user = userJson ? JSON.parse(userJson) : null;
    return { token, user };
  } catch {
    return { token: null, user: null };
  }
}

// Create a root route
const rootRoute = new RootRoute({
  component: RootLayout,
});

// Login route - public
const loginRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

// Dashboard route - protected, requires authentication
const dashboardRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardPage,
  beforeLoad: ({ location }) => {
    // Check authentication from localStorage
    const { user, token } = getStoredAuthState();
    
    // If not authenticated, redirect to login
    if (!user || !token) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      });
    }

    // Role-based access examples (uncomment to use):
    // if (user.role !== 'Admin') {
    //   throw redirect({
    //     to: '/unauthorized',
    //   });
    // }
  },
});

// Catch-all 404 route
const notFoundRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '*',
  component: NotFoundPage,
});

// Create the route tree
const routeTree = rootRoute.addChildren([loginRoute, dashboardRoute, notFoundRoute]);

// Create and export the router
export const router = createRouter({
  routeTree,
});

// Register the router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
