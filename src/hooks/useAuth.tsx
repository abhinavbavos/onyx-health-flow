import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/auth.service';
import { tokenManager } from '@/lib/api-client';
import { UserRole } from '@/types/roles';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: UserRole | null;
  userEmail: string | null;
  login: (role: UserRole, email: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const role = localStorage.getItem('userRole') as UserRole;
    const email = localStorage.getItem('userEmail');
    const hasToken = tokenManager.isAuthenticated();

    if (role && email && hasToken) {
      setUserRole(role);
      setUserEmail(email);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = (role: UserRole, email: string) => {
    localStorage.setItem('userRole', role);
    localStorage.setItem('userEmail', email);
    setUserRole(role);
    setUserEmail(email);
    setIsAuthenticated(true);
  };

  const logout = () => {
    authService.logout();
    setUserRole(null);
    setUserEmail(null);
    setIsAuthenticated(false);
    toast({
      title: 'Logged out successfully',
    });
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userRole,
        userEmail,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
