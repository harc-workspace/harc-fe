import { createRouter, RootRoute, Route, redirect } from '@tanstack/react-router';
import { RootLayout } from '@/layouts/RootLayout';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { HomePage } from '@/pages/dashboard/HomePage';
import { ProfilePage } from '@/pages/dashboard/ProfilePage';
import { TimeOffPage } from '@/pages/dashboard/TimeOffPage';
import { PayrollPage } from '@/pages/dashboard/PayrollPage';
import { DocumentsPage } from '@/pages/dashboard/DocumentsPage';
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

// Root route - decide where the app should start
const homeRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    const { user, token } = getStoredAuthState();

    if (user && token) {
      throw redirect({ to: '/dashboard' });
    }

    throw redirect({ to: '/login' });
  },
  component: () => null,
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
  component: DashboardLayout,
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

const dashboardHomeRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: 'home',
  component: HomePage,
});

const dashboardProfileRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: 'profile',
  component: ProfilePage,
});

const dashboardTimeOffRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: 'time-off',
  component: TimeOffPage,
});

const dashboardPayrollRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: 'payroll',
  component: PayrollPage,
});

const dashboardDocumentsRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: 'documents',
  component: DocumentsPage,
});

const dashboardIndexRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/dashboard/home' });
  },
  component: () => null,
});

// Catch-all 404 route
const notFoundRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '*',
  component: NotFoundPage,
});

const dashboardTree = dashboardRoute.addChildren([
  dashboardIndexRoute,
  dashboardHomeRoute,
  dashboardProfileRoute,
  dashboardTimeOffRoute,
  dashboardPayrollRoute,
  dashboardDocumentsRoute,
]);

// Create the route tree
const routeTree = rootRoute.addChildren([homeRoute, loginRoute, dashboardTree, notFoundRoute]);

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
