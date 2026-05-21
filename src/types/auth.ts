export type UserRole = 'Admin' | 'Hr Manager' | 'Employee';

export interface User {
  id: string; // GUID from backend database
  email: string; // Google verified email, unique login key
  fullName: string; // Display name for UI
  role: UserRole; // RBAC
  avatarUrl: string | null; // Google profile picture
}

export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  token: string | null;
  setToken: (token: string | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export interface AuthResponse {
  token: string;
  user: User;
}
