'use client';

import { createContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { AuthContextType, User } from '@/types/auth';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Restore from localStorage on mount
  if (!isHydrated) {
    try {
      const savedToken = localStorage.getItem('auth_token');
      const savedUser = localStorage.getItem('auth_user');
      
      if (savedToken) setToken(savedToken);
      if (savedUser) setUser(JSON.parse(savedUser));
    } catch (error) {
      console.error('Failed to restore auth from localStorage:', error);
    }
    setIsHydrated(true);
  }

  // Persist token to localStorage when it changes
  if (token) {
    try {
      localStorage.setItem('auth_token', token);
    } catch (error) {
      console.error('Failed to persist token:', error);
    }
  } else {
    try {
      localStorage.removeItem('auth_token');
    } catch (error) {
      console.error('Failed to remove token:', error);
    }
  }

  // Persist user to localStorage when it changes
  if (user) {
    try {
      localStorage.setItem('auth_user', JSON.stringify(user));
    } catch (error) {
      console.error('Failed to persist user:', error);
    }
  } else {
    try {
      localStorage.removeItem('auth_user');
    } catch (error) {
      console.error('Failed to remove user:', error);
    }
  }

  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken, isLoading, setIsLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
