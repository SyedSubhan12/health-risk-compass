import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { User, Home, MessageCircle, Settings, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export function NavBar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isPatient = user?.role === "patient";
  const isDoctor = user?.role === "doctor";

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2">
            <Heart className="h-6 w-6 text-health-primary" />
            <span className="font-bold text-xl text-health-secondary">Health Risk Compass</span>
          </Link>
        </div>
        
        <nav className="flex items-center space-x-2">
          <Button
            variant={isActive("/") ? "default" : "ghost"}
            size="sm"
            asChild
          >
            <Link to="/" className="flex items-center">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Link>
          </Button>

          {isPatient && (
            <>
              <Button
                variant={isActive("/patient-dashboard") ? "default" : "ghost"}
                size="sm"
                asChild
              >
                <Link to="/patient-dashboard" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
              <Button
                variant={isActive("/health-assessment") ? "default" : "ghost"}
                size="sm"
                asChild
              >
                <Link to="/health-assessment" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Health Analysis
                </Link>
              </Button>
              <Button
                variant={isActive("/book-appointment") ? "default" : "ghost"}
                size="sm"
                asChild
              >
                <Link to="/book-appointment" className="flex items-center">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Book Appointment
                </Link>
              </Button>
            </>
          )}
          
          {isDoctor && (
            <>
              <Button
                variant={isActive("/doctor-dashboard") ? "default" : "ghost"}
                size="sm"
                asChild
              >
                <Link to="/doctor-dashboard" className="flex items-center">
                  <Home className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
              <Button
                variant={isActive("/doctor-insights") ? "default" : "ghost"}
                size="sm"
                asChild
              >
                <Link to="/doctor-insights" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Insights
                </Link>
              </Button>
            </>
          )}
          
          <Button
            variant={isActive("/profile") ? "default" : "ghost"}
            size="sm"
            asChild
          >
            <Link to="/profile" className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              Profile
            </Link>
          </Button>

          <Button variant="ghost" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </nav>
      </div>
    </header>
  );
}
