
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import PatientDashboard from "./pages/patient/PatientDashboard";
import PatientPrediction from "./pages/patient/PatientPrediction";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorInsights from "./pages/doctor/DoctorInsights";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ 
  children, 
  allowedRole 
}: { 
  children: React.ReactNode;
  allowedRole?: "patient" | "doctor";
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    if (user.role === "patient") {
      return <Navigate to="/patient-dashboard" replace />;
    } else {
      return <Navigate to="/doctor-dashboard" replace />;
    }
  }

  return <>{children}</>;
};

// Auth layout wrapper for login/signup pages
const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  
  if (user) {
    if (user.role === "patient") {
      return <Navigate to="/patient-dashboard" replace />;
    } else {
      return <Navigate to="/doctor-dashboard" replace />;
    }
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/" element={<AuthLayout><Index /></AuthLayout>} />
      <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
      <Route path="/signup" element={<AuthLayout><Signup /></AuthLayout>} />
      <Route path="/forgot-password" element={<AuthLayout><ForgotPassword /></AuthLayout>} />
      
      {/* Patient routes */}
      <Route 
        path="/patient-dashboard" 
        element={
          <ProtectedRoute allowedRole="patient">
            <PatientDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/patient-prediction" 
        element={
          <ProtectedRoute allowedRole="patient">
            <PatientPrediction />
          </ProtectedRoute>
        } 
      />
      
      {/* Doctor routes */}
      <Route 
        path="/doctor-dashboard" 
        element={
          <ProtectedRoute allowedRole="doctor">
            <DoctorDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/doctor-insights" 
        element={
          <ProtectedRoute allowedRole="doctor">
            <DoctorInsights />
          </ProtectedRoute>
        }  
      />
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
