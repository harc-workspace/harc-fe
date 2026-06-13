export interface User {
  id: string; // GUID from backend database
  email: string; // Google verified email, unique login key
  fullName: string; // Display name for UI
  role: string; // RBAC
  roleDisplayName: Record<string, string>; // Human-readable role name for UI, e.g. "Admin", "User"
  avatarUrl: string | null; // Google profile picture
}

export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  token: string | null;
  setToken: (token: string | null) => void;
}

export interface MeResponse {
  message: string;
  internalUserId: string;
  userEmail: string;
  assignedRole: string;
  assignedRoleDisplayName: Record<string, string>;
  avatar: string | null;
}

export interface AuthResponse {
  token: string;
  user: User;
}
