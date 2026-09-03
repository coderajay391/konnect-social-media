import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { authApi } from '../services/api/authApi';
import { storage } from '../utils/storage';
import { STORAGE_KEYS } from '../utils/constants';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  register: (data: { name: string; username: string; email: string; password?: string }) => Promise<void>;
  logout: () => void;
  updateCurrentUser: (data: Partial<User>) => void;
  refreshUser: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ message: string }>;
  resetPassword: (token: string, password: string) => Promise<{ message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    return storage.get<User | null>(STORAGE_KEYS.CURRENT_USER, null);
  });
  const [token, setToken] = useState<string | null>(() => {
    return storage.get<string | null>(STORAGE_KEYS.AUTH_TOKEN, null);
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize and verify authentication on mount
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = storage.get<string | null>(STORAGE_KEYS.AUTH_TOKEN, null);
      const savedUser = storage.get<User | null>(STORAGE_KEYS.CURRENT_USER, null);

      if (savedToken && savedUser) {
        try {
          const freshUser = await authApi.getMe(savedUser.id);
          setUser(freshUser);
          storage.set(STORAGE_KEYS.CURRENT_USER, freshUser);
        } catch {
          // If token verification fails, keep stored user or reset
          setUser(savedUser);
        }
      } else {
        // Pre-seed demo login for instant exploration if never visited
        try {
          const demoRes = await authApi.login('alex@example.com', 'password123');
          setUser(demoRes.user);
          setToken(demoRes.token);
          storage.set(STORAGE_KEYS.CURRENT_USER, demoRes.user);
          storage.set(STORAGE_KEYS.AUTH_TOKEN, demoRes.token);
        } catch (err) {
          console.error('Failed to init demo auth:', err);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password?: string) => {
    setIsLoading(true);
    try {
      const res = await authApi.login(email, password);
      setUser(res.user);
      setToken(res.token);
      storage.set(STORAGE_KEYS.CURRENT_USER, res.user);
      storage.set(STORAGE_KEYS.AUTH_TOKEN, res.token);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: { name: string; username: string; email: string; password?: string }) => {
    setIsLoading(true);
    try {
      const res = await authApi.register(data);
      setUser(res.user);
      setToken(res.token);
      storage.set(STORAGE_KEYS.CURRENT_USER, res.user);
      storage.set(STORAGE_KEYS.AUTH_TOKEN, res.token);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    storage.remove(STORAGE_KEYS.CURRENT_USER);
    storage.remove(STORAGE_KEYS.AUTH_TOKEN);
  }, []);

  const updateCurrentUser = useCallback((data: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...data };
      storage.set(STORAGE_KEYS.CURRENT_USER, updated);
      return updated;
    });
  }, []);

  const refreshUser = useCallback(async () => {
    if (!user) return;
    try {
      const fresh = await authApi.getMe(user.id);
      setUser(fresh);
      storage.set(STORAGE_KEYS.CURRENT_USER, fresh);
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  }, [user]);

  const forgotPassword = async (email: string) => {
    return authApi.forgotPassword(email);
  };

  const resetPassword = async (tkn: string, pass: string) => {
    return authApi.resetPassword(tkn, pass);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        register,
        logout,
        updateCurrentUser,
        refreshUser,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
