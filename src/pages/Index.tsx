
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, Shield, UserCheck, HeartPulse, Lock } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-health-light">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-8 md:py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-health-dark mb-4">
          Health Risk <span className="text-health-primary">Compass</span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Your personalized healthcare risk prediction system for proactive health management
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="text-lg">
            <Link to="/signup">Create Account</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-lg">
            <Link to="/login">Sign In</Link>
          </Button>
        </div>
      </header>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-12">Comprehensive Health Monitoring</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-health-primary/10 p-3 rounded-lg">
                  <HeartPulse className="h-8 w-8 text-health-primary" />
                </div>
                <h3 className="text-xl font-semibold">Risk Assessment</h3>
              </div>
              <p className="text-muted-foreground">
                Advanced algorithms analyze your health data to predict risks for various chronic conditions.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-health-primary/10 p-3 rounded-lg">
                  <UserCheck className="h-8 w-8 text-health-primary" />
                </div>
                <h3 className="text-xl font-semibold">Doctor Connection</h3>
              </div>
              <p className="text-muted-foreground">
                Connect directly with healthcare providers who can review your risk assessments and provide guidance.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-health-primary/10 p-3 rounded-lg">
                  <Activity className="h-8 w-8 text-health-primary" />
                </div>
                <h3 className="text-xl font-semibold">Health Tracking</h3>
              </div>
              <p className="text-muted-foreground">
                Monitor your health metrics over time and receive personalized recommendations for improvement.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Role-Based Section */}
      <section className="bg-health-primary/5 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Tailored for Patients & Doctors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-2xl font-semibold mb-4">For Patients</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="mt-1 text-health-primary">•</div>
                    <span>Personalized dashboard with risk scores and insights</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 text-health-primary">•</div>
                    <span>Real-time risk prediction based on your health data</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 text-health-primary">•</div>
                    <span>Connect with specialists for personalized care</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 text-health-primary">•</div>
                    <span>Track your health progress over time</span>
                  </li>
                </ul>
                <Button asChild className="mt-6 w-full">
                  <Link to="/signup">Join as Patient</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-2xl font-semibold mb-4">For Doctors</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="mt-1 text-health-primary">•</div>
                    <span>Comprehensive dashboard to manage multiple patients</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 text-health-primary">•</div>
                    <span>Detailed insights into patient health risks</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 text-health-primary">•</div>
                    <span>Tools to provide personalized medical advice</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 text-health-primary">•</div>
                    <span>Advanced analytics for population health monitoring</span>
                  </li>
                </ul>
                <Button asChild className="mt-6 w-full">
                  <Link to="/signup">Join as Doctor</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="bg-health-primary/10 p-4 rounded-full">
              <Shield className="h-12 w-12 text-health-primary" />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-4">Your Data Security is Our Priority</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Health Risk Compass employs industry-leading security protocols to ensure your health data remains private and protected.
          </p>
          <div className="flex justify-center">
            <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium">
              <Lock className="h-3.5 w-3.5 mr-1" /> Encrypted & Secure
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-health-dark text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold">Health Risk Compass</h2>
              <p className="text-gray-300">Personalized healthcare risk prediction</p>
            </div>
            <div className="flex gap-4">
              <Link to="/login" className="text-white hover:text-health-primary">Login</Link>
              <Link to="/signup" className="text-white hover:text-health-primary">Sign Up</Link>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-300 text-sm">
            <p>&copy; 2025 Health Risk Compass. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
