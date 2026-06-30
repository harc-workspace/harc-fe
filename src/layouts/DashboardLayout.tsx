import { Outlet, useRouterState } from '@tanstack/react-router';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { getDashboardSectionFromPath } from '@/components/dashboard/dashboardSections';
import { useLogoutMutation } from '@/hooks/useAuthMutations';

export function DashboardLayout() {
  const logoutMutation = useLogoutMutation();
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  const activeSection = getDashboardSectionFromPath(pathname);

  return (
    <SidebarProvider defaultOpen>
      <DashboardSidebar
        activeSection={activeSection}
        onLogout={() => logoutMutation.mutate()}
        isLoggingOut={logoutMutation.isPending}
      />

      <SidebarInset>
        <div className="min-h-screen bg-background text-foreground">
          <div className="flex w-full flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
            <main>
              <Outlet />
            </main>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}