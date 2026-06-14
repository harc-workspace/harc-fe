import { Outlet, useRouterState } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { getDashboardSectionFromPath, dashboardSections } from '@/components/dashboard/dashboardSections';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLogoutMutation } from '@/hooks/useAuthMutations';

export function DashboardLayout() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const logoutMutation = useLogoutMutation();
  const { t } = useTranslation();
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  const activeSection = getDashboardSectionFromPath(pathname);
  const activeSectionConfig = dashboardSections.find((section) => section.key === activeSection) ?? dashboardSections[0];

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
            <div className="flex items-center justify-between gap-4 rounded-sm border border-border bg-card/70 px-4 py-3 shadow-sm backdrop-blur">
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{t('dashboard.title')}</p>
                  <h1 className="text-xl font-semibold">{t(activeSectionConfig.labelKey)}</h1>
                </div>
              </div>

              <div className="hidden text-sm text-muted-foreground sm:block">
                {user?.roleDisplayName[language]}
              </div>
            </div>

            <main>
              <Outlet />
            </main>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}