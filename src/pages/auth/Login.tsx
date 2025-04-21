
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, clearError, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please provide both email and password",
      });
      return;
    }
    await login(email, password);
  };

  const handleDemoLogin = async (type: 'patient' | 'doctor') => {
    try {
      const email = type === 'patient' ? "patient@example.com" : "doctor@example.com";
      const password = "password123";
      
      setEmail(email);
      setPassword(password);
      
      // Give a slight delay to update the UI before submitting
      setTimeout(() => {
        login(email, password);
      }, 100);
    } catch (err) {
      console.error("Demo login error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md px-4">
        <Card className="shadow-lg border-health-primary/20">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-health-secondary">
              Health Risk Compass
            </CardTitle>
            <CardDescription className="text-center">
              Sign in to access your health dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => {
                    clearError();
                    setEmail(e.target.value);
                  }}
                  required
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-health-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    clearError();
                    setPassword(e.target.value);
                  }}
                  required
                  autoComplete="current-password"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
              
              {/* Demo access buttons */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                <Button
                  variant="outline"
                  type="button"
                  className="text-xs"
                  onClick={() => handleDemoLogin('patient')}
                >
                  Demo Patient
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  className="text-xs"
                  onClick={() => handleDemoLogin('doctor')}
                >
                  Demo Doctor
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="text-health-primary hover:underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
