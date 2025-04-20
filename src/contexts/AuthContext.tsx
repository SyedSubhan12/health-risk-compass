
import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface UserWithRole extends User {
  role?: "patient" | "doctor";
  name?: string;
}

interface AuthContextType {
  user: UserWithRole | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role: "patient" | "doctor") => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (password: string, token: string) => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  forgotPassword: async () => {},
  resetPassword: async () => {},
  error: null,
  clearError: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserWithRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        setUser({
          ...session.user,
          role: profile?.role as "patient" | "doctor",
          name: profile?.full_name
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile }) => {
            setUser({
              ...session.user,
              role: profile?.role as "patient" | "doctor",
              name: profile?.full_name
            });
          });
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      // Navigation is handled by onAuthStateChange
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
    } catch (err) {
      setError((err as Error).message);
      toast({
        variant: "destructive",
        title: "Error",
        description: (err as Error).message,
      });
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string, role: "patient" | "doctor") => {
    try {
      setLoading(true);
      setError(null);
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: role,
          },
        },
      });

      if (signUpError) throw signUpError;

      toast({
        title: "Account created",
        description: "Please check your email to verify your account.",
      });

      // Return to login page after successful signup
      navigate("/login");
    } catch (err) {
      setError((err as Error).message);
      toast({
        variant: "destructive",
        title: "Error",
        description: (err as Error).message,
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;
      
      navigate("/login");
      toast({
        title: "Logout successful",
        description: "You have been logged out.",
      });
    } catch (err) {
      setError((err as Error).message);
      toast({
        variant: "destructive",
        title: "Error",
        description: (err as Error).message,
      });
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/reset-password",
      });

      if (error) throw error;

      toast({
        title: "Reset link sent",
        description: "Please check your email for the password reset link.",
      });
    } catch (err) {
      setError((err as Error).message);
      toast({
        variant: "destructive",
        title: "Error",
        description: (err as Error).message,
      });
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (password: string, token: string) => {
    try {
      setLoading(true);
      setError(null);
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      toast({
        title: "Password updated",
        description: "Your password has been successfully updated.",
      });
      navigate("/login");
    } catch (err) {
      setError((err as Error).message);
      toast({
        variant: "destructive",
        title: "Error",
        description: (err as Error).message,
      });
    } finally {
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
