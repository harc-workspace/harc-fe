'use client';

import { createContext, useState, type ReactNode } from 'react';
import type { User } from '@/types/auth';

export const AuthContext = createContext<{
  user: User | null;
  setUser: (user: User | null) => void;
  token: string | null;
  setToken: (token: string | null) => void;
} | undefined>(undefined);

const persistToken = (token: string | null) => {
  try {
    if (token) {
      localStorage.setItem('google_id_token', token);
    } else {
      localStorage.removeItem('google_id_token');
    }
  } catch (error) {
    console.error('Failed to persist token:', error);
  }
};

const persistUser = (user: User | null) => {
  try {
    if (user) {
      localStorage.setItem('auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('auth_user');
    }
  } catch (error) {
    console.error('Failed to persist user:', error);
  }
};

const loadToken = (): string | null => {
  try {
    return localStorage.getItem('google_id_token');
  } catch {
    return null;
  }
};

const loadUser = (): User | null => {
  try {
    const saved = localStorage.getItem('auth_user');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(loadUser);
  const [token, setToken] = useState<string | null>(loadToken);

  const handleSetUser = (newUser: User | null) => {
    setUser(newUser);
    persistUser(newUser);
  };

  const handleSetToken = (newToken: string | null) => {
    setToken(newToken);
    persistToken(newToken);
  };

  return (
    <AuthContext.Provider value={{ user, setUser: handleSetUser, token, setToken: handleSetToken }}>
      {children}
    </AuthContext.Provider>
  );
}
