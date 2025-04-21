import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, Home, Calendar, Stethoscope, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/health-assessment', label: 'Health Assessment', icon: Stethoscope },
    { path: '/book-appointment', label: 'Book Appointment', icon: Calendar },
    { path: '/profile', label: 'Profile', icon: User }
  ];

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2">
            <Heart className="h-6 w-6 text-health-primary" />
            <span className="font-bold text-xl text-health-secondary">Personal Healthcare</span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Button
                key={item.path}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "flex items-center gap-2",
                  isActive && "bg-health-primary text-white hover:bg-health-primary/90"
                )}
                asChild
              >
                <Link to={item.path}>
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
} 