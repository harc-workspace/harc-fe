'use client';

import { useState, type ReactNode } from 'react';
import type { User } from '@/types/auth';
import { AuthContext } from './authContext';

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
  const [isLoading, setIsLoading] = useState(false);

  const handleSetUser = (newUser: User | null) => {
    setUser(newUser);
    persistUser(newUser);
  };

  const handleSetToken = (newToken: string | null) => {
    setToken(newToken);
    persistToken(newToken);
  };

  return (
    <AuthContext.Provider value={{ user, setUser: handleSetUser, token, setToken: handleSetToken, isLoading, setIsLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
