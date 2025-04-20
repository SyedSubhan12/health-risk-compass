
import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Define User type with roles
type UserRole = "patient" | "doctor";

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (password: string, token: string) => Promise<void>;
  error: string | null;
  clearError: () => void;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
  forgotPassword: async () => {},
  resetPassword: async () => {},
  error: null,
  clearError: () => {},
});

// Mock user data - In a real application, this would come from a backend
const MOCK_USERS = [
  {
    id: "1",
    email: "patient@example.com",
    password: "password123",
    name: "John Doe",
    role: "patient" as UserRole,
  },
  {
    id: "2",
    email: "doctor@example.com",
    password: "password123",
    name: "Dr. Jane Smith",
    role: "doctor" as UserRole,
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check if user is already logged in from localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      // Simulate API call with mock users
      const mockUser = MOCK_USERS.find(
        (u) => u.email === email && u.password === password
      );

      if (!mockUser) {
        throw new Error("Invalid email or password");
      }

      // Remove password before storing user
      const { password: _, ...userWithoutPassword } = mockUser;
      
      setUser(userWithoutPassword);
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      
      // Redirect based on role
      if (userWithoutPassword.role === "patient") {
        navigate("/patient-dashboard");
      } else {
        navigate("/doctor-dashboard");
      }
      
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string, role: UserRole) => {
    try {
      setLoading(true);
      
      // Check if email already exists
      const userExists = MOCK_USERS.some((u) => u.email === email);
      if (userExists) {
        throw new Error("Email already in use");
      }

      // In a real app, this would be an API call to create a user
      const newUser = {
        id: `${MOCK_USERS.length + 1}`,
        email,
        name,
        role,
      };

      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      
      // Redirect based on role
      if (role === "patient") {
        navigate("/patient-dashboard");
      } else {
        navigate("/doctor-dashboard");
      }
      
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
  };

  const forgotPassword = async (email: string) => {
    try {
      setLoading(true);
      // In a real app, this would send a reset email
      // Here we'll just simulate success
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  };

  const resetPassword = async (password: string, token: string) => {
    try {
      setLoading(true);
      // In a real app, this would validate the token and update the password
      // Here we'll just simulate success
      setTimeout(() => {
        setLoading(false);
        navigate("/login");
      }, 1000);
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        forgotPassword,
        resetPassword,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
