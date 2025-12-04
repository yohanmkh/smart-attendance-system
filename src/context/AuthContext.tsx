import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, UserRole } from '@/types/attendance';

interface AuthContextType {
  user: User | null;
  selectedRole: UserRole | null;
  setSelectedRole: (role: UserRole) => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: Record<string, User> = {
  'lecturer@university.edu': {
    id: 'lec-001',
    email: 'lecturer@university.edu',
    name: 'Dr. Sarah Johnson',
    role: 'lecturer',
    department: 'Computer Science',
  },
  'student@university.edu': {
    id: 'stu-001',
    email: 'student@university.edu',
    name: 'Alex Chen',
    role: 'student',
    studentId: 'CS2024001',
    department: 'Computer Science',
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser = mockUsers[email.toLowerCase()];
    if (mockUser && password.length >= 6) {
      if (mockUser.role === selectedRole) {
        setUser(mockUser);
        return true;
      }
    }
    return false;
  }, [selectedRole]);

  const logout = useCallback(() => {
    setUser(null);
    setSelectedRole(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        selectedRole,
        setSelectedRole,
        login,
        logout,
        isAuthenticated: !!user,
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
