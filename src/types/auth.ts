export interface OrganizationComponent {
  id: number;
  name: string;
  displayName: Record<string, string>;
}

export interface ManagerInfo {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string | null;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  roleDisplayName: Record<string, string>;
  avatarUrl: string | null;
  team: OrganizationComponent | null;
  title: OrganizationComponent | null;
  manager: ManagerInfo | null;
}

export interface MeResponse {
  internalUserId: string;
  userEmail: string;
  assignedRole: string;
  assignedRoleDisplayName: Record<string, string>;
  avatar: string | null;
  team: OrganizationComponent | null;
  title: OrganizationComponent | null;
  manager: ManagerInfo | null;
}

export interface AuthResponse {
  token: string;
  user: User;
}