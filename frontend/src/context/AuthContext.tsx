import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, RoleType } from '../types';
import { authApi } from '../api/client';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  role: RoleType | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  quickDemoLogin: (targetRole: 'learner' | 'trainer' | 'admin') => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('statiq_token'));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('statiq_token');
      if (storedToken) {
        try {
          const profile = await authApi.getCurrentUser();
          setUser({
            id: profile.userId,
            email: profile.email,
            fullName: profile.fullName,
            roles: profile.roles as RoleType[],
            profileId: profile.profileId,
            employeeId: profile.employeeId,
            designation: profile.designation,
            jobRole: profile.jobRole,
            departmentName: profile.departmentName,
          });
        } catch (err) {
          console.error('Failed to load current user', err);
          localStorage.removeItem('statiq_token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const authData = await authApi.login({ email, password });
    localStorage.setItem('statiq_token', authData.token);
    setToken(authData.token);
    setUser({
      id: authData.id,
      email: authData.email,
      fullName: authData.fullName,
      roles: authData.roles as RoleType[],
      profileId: authData.profileId,
      employeeId: authData.employeeId,
      designation: authData.designation,
      jobRole: authData.jobRole,
      departmentName: authData.departmentName,
    });
  };

  const register = async (data: any) => {
    const authData = await authApi.register(data);
    localStorage.setItem('statiq_token', authData.token);
    setToken(authData.token);
    setUser({
      id: authData.id,
      email: authData.email,
      fullName: authData.fullName,
      roles: authData.roles as RoleType[],
      profileId: authData.profileId,
      employeeId: authData.employeeId,
      designation: authData.designation,
      jobRole: authData.jobRole,
      departmentName: authData.departmentName,
    });
  };

  const quickDemoLogin = async (targetRole: 'learner' | 'trainer' | 'admin') => {
    const email = `${targetRole}@statiq.gov`;
    await login(email, 'Statiq@2025');
  };

  const logout = () => {
    localStorage.removeItem('statiq_token');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const profile = await authApi.getCurrentUser();
      setUser({
        id: profile.userId,
        email: profile.email,
        fullName: profile.fullName,
        roles: profile.roles as RoleType[],
        profileId: profile.profileId,
        employeeId: profile.employeeId,
        designation: profile.designation,
        jobRole: profile.jobRole,
        departmentName: profile.departmentName,
      });
    } catch (err) {
      console.error('Failed to refresh user', err);
    }
  };

  const currentRole: RoleType | null = user?.roles?.[0] || null;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        role: currentRole,
        loading,
        login,
        register,
        logout,
        quickDemoLogin,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
