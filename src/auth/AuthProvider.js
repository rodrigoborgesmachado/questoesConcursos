import { createContext, useContext, useMemo, useState, useCallback, useEffect } from 'react';
import { authService } from '../services/auth/authService';
import { Roles } from './roles';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const loadSession = useCallback(() => {
    const storedSession = authService.getSession();
    setSession(storedSession);
    return storedSession;
  }, []);

  useEffect(() => {
    loadSession();
    setIsInitialized(true);
  }, [loadSession]);

  const login = useCallback(async ({ email, password }) => {
    const nextSession = await authService.login({ email, password });
    setSession(authService.getSession() || nextSession);
    return nextSession;
  }, []);

  const logout = useCallback((options) => {
    authService.logout(options);
    setSession(null);
  }, []);

  const value = useMemo(() => {
    const role = session?.role || Roles.User;

    return {
      isInitialized,
      session,
      role,
      isAuthenticated: !!session?.token,
      login,
      logout,
      refreshSession: loadSession,
    };
  }, [isInitialized, session, login, logout, loadSession]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
