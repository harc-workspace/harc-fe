import { dashboardSections, type DashboardSection } from "@/components/dashboard/dashboardSections";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import * as sidebar from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { SidebarSettings } from "../SidebarSettings";
import { TooltipProvider } from "../ui/tooltip";

interface DashboardSidebarProps {
  activeSection: DashboardSection;
  onLogout: () => void;
  isLoggingOut: boolean;
}

export function DashboardSidebar({
  activeSection,
  onLogout,
  isLoggingOut,
}: DashboardSidebarProps) {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <sidebar.Sidebar variant="inset" collapsible="icon">
      <sidebar.SidebarHeader>
        <div className="flex items-center justify-between p-1">
          <div className="text-xl font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
            HARC
          </div>
          <sidebar.SidebarTrigger className="scale-125" />
        </div>
      </sidebar.SidebarHeader>

      <sidebar.SidebarContent>
        <sidebar.SidebarGroup>
          <sidebar.SidebarGroupContent>
            <sidebar.SidebarMenu>
              {dashboardSections.map((section) => {
                const Icon = section.icon;

                return (
                  <sidebar.SidebarMenuItem key={section.key}>
                    <TooltipProvider>
                      <sidebar.SidebarMenuButton
                        asChild
                        isActive={activeSection === section.key}
                        tooltip={t(section.labelKey)}
                      >
                        <Link to={section.to}>
                          <Icon />
                          <span>{t(section.labelKey)}</span>
                        </Link>
                      </sidebar.SidebarMenuButton>
                    </TooltipProvider>
                  </sidebar.SidebarMenuItem>
                );
              })}
            </sidebar.SidebarMenu>
          </sidebar.SidebarGroupContent>
        </sidebar.SidebarGroup>
      </sidebar.SidebarContent>

      <sidebar.SidebarFooter className="flex flex-row items-center justify-between p-2 group-data-[collapsible=icon]:justify-center">
        <div className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.avatarUrl || ""} />
            <AvatarFallback>{user?.fullName?.charAt(0) || "CN"}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-0.5">
            <p className="text-xs font-medium">{user?.fullName}</p>
            <p className="text-[10px] text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <SidebarSettings onLogout={onLogout} isLoggingOut={isLoggingOut} />
      </sidebar.SidebarFooter>
    </sidebar.Sidebar>
  );
}
