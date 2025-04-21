
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { User, Home, MessageCircle, Settings } from "lucide-react";

export function NavBar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isPatient = user?.role === "patient";
  const isDoctor = user?.role === "doctor";

  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">HealthRisk</span>
            <span className="text-xl font-medium">Compass</span>
          </Link>
        </div>
        
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center space-x-1">
            {isPatient && (
              <>
                <Button
                  variant={isActive("/patient-dashboard") ? "default" : "ghost"}
                  size="sm"
                  asChild
                >
                  <Link to="/patient-dashboard" className="flex items-center">
                    <Home className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>
                <Button
                  variant={isActive("/model-prediction") ? "default" : "ghost"}
                  size="sm"
                  asChild
                >
                  <Link to="/model-prediction" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Health Analysis
                  </Link>
                </Button>
                <Button
                  variant={isActive("/doctors") ? "default" : "ghost"}
                  size="sm"
                  asChild
                >
                  <Link to="/doctors" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Doctors
                  </Link>
                </Button>
                <Button
                  variant={isActive("/messages") ? "default" : "ghost"}
                  size="sm"
                  asChild
                >
                  <Link to="/messages" className="flex items-center">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Messages
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
                <Button
                  variant={isActive("/messages") ? "default" : "ghost"}
                  size="sm"
                  asChild
                >
                  <Link to="/messages" className="flex items-center">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Messages
                  </Link>
                </Button>
              </>
            )}
            
            <Button variant="ghost" size="sm" onClick={logout}>
              Logout
            </Button>
            
            <Button variant="outline" size="sm" asChild>
              <Link to="#">
                <User className="h-4 w-4" />
              </Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
