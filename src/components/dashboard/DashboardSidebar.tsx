import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  dashboardSections,
  type DashboardSection,
} from "@/components/dashboard/dashboardSections";
import { SidebarSettings } from "../SidebarSettings";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";

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
    <Sidebar variant="inset">
      <SidebarHeader>
        <div className="p-2">
          <div className="text-xl font-semibold text-sidebar-foreground">
            HARC
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {dashboardSections.map((section) => {
                const Icon = section.icon;

                return (
                  <SidebarMenuItem key={section.key}>
                    <SidebarMenuButton
                      asChild
                      isActive={activeSection === section.key}
                    >
                      <Link to={section.to}>
                        <Icon />
                        <span>{t(section.labelKey)}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="flex flex-row items-end justify-between align-baseline pb-4 pl-0 pr-0">
        <div className="flex items-center gap-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.avatarUrl || ""} />
            <AvatarFallback>{user?.fullName?.charAt(0) || "CN"}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-0.5">
            <p className="text-xs font-medium">{user?.fullName}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <SidebarSettings onLogout={onLogout} isLoggingOut={isLoggingOut} />
      </SidebarFooter>
    </Sidebar>
  );
}
