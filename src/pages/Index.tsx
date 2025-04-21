
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HeartPulse, Activity, UserCheck, Shield, Lock } from "lucide-react";
import HealthAdvisoryPanel from "@/components/HealthAdvisoryPanel";

// Demo hero image url
const heroImg = "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=800&q=80";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-health-light">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-12 md:py-20 text-center flex flex-col items-center">
        <img src={heroImg} alt="Health Risk Compass" className="w-60 h-60 object-cover rounded-2xl mb-6 shadow-lg mx-auto border-4 border-health-primary/30"/>
        <h1 className="text-4xl md:text-6xl font-bold text-health-dark mb-4 leading-tight">
          <span className="text-health-primary drop-shadow">Health Risk Compass</span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Your proactive partner in personal health risk prediction and prevention. Get real insights, actionable recommendations, and expert care—empowering you for a healthier tomorrow!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <Button asChild size="lg" className="text-lg animate-scale-in">
            <Link to="/signup">Get Started</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-lg animate-fade-in">
            <Link to="/login">Sign In</Link>
          </Button>
        </div>
      </header>

      {/* What is Health Risk Compass */}
      <section className="container mx-auto px-4 pb-16">
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
          <div className="flex-1 fade-in">
            <h2 className="text-3xl font-bold mb-3 text-health-primary">What is it?</h2>
            <p className="text-lg text-health-dark mb-4">
              <b>Health Risk Compass</b> provides you with a personalized, science-backed health risk assessment—combining your health profile and lifestyle to recommend preventive actions, tips, and health checkups.
              <br /><br />
              We use advanced risk models, expert medical input, and secure technology to help you understand, track, and improve your health.
            </p>
            <ul className="list-disc pl-6 text-health-secondary space-y-2 font-medium">
              <li>Instant & easy-to-read risk prediction</li>
              <li>Actionable lifestyle and medical test suggestions</li>
              <li>Doctor connect & reminders for best care</li>
              <li>Visual dashboards, charts, and progress logs</li>
            </ul>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <Card className="bg-white/80 shadow-lg animate-fade-in max-w-xs">
              <CardContent className="pt-8 pb-8">
                <HeartPulse className="h-16 w-16 text-health-primary mx-auto mb-4 pulse"/>
                <div className="font-bold text-2xl mb-2 text-center">Your Health, Visualized</div>
                <div className="text-muted-foreground text-center">Get clear, color-coded risk indicators and progress snapshots anytime. Stay motivated with every milestone!</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Advisory Demo Panel */}
      <section className="container mx-auto px-4 pb-16">
        <h2 className="text-3xl font-bold mb-6 text-health-primary text-center">
          See your Personalized Health Advisory
        </h2>
        <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          After a quick assessment, you'll receive a structured panel of lifestyle changes, test reminders, and doctor visits for your unique health profile.
        </p>
        <HealthAdvisoryPanel />
      </section>
      
      {/* Features Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-12 text-health-primary">Why Choose Health Risk Compass?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="bg-white/90 shadow-md animate-fade-in">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-health-primary/10 p-3 rounded-lg">
                  <HeartPulse className="h-8 w-8 text-health-primary" />
                </div>
                <h3 className="text-xl font-semibold text-health-dark">Risk Assessment</h3>
              </div>
              <p className="text-muted-foreground">
                Advanced algorithms analyze your health data to predict risks for various chronic conditions, presenting you with simple color-coded results.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 shadow-md animate-scale-in">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-health-primary/10 p-3 rounded-lg">
                  <UserCheck className="h-8 w-8 text-health-primary" />
                </div>
                <h3 className="text-xl font-semibold text-health-dark">Doctor Connection</h3>
              </div>
              <p className="text-muted-foreground">
                Instantly connect with providers, share reports, and schedule appointments—all at your fingertips.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 shadow-md animate-fade-in">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-health-primary/10 p-3 rounded-lg">
                  <Activity className="h-8 w-8 text-health-primary" />
                </div>
                <h3 className="text-xl font-semibold text-health-dark">Health Tracking</h3>
              </div>
              <p className="text-muted-foreground">
                Monitor your health metrics and get intelligent, motivational nudges to achieve your goals.
              </p>
            </CardContent>
          </Card>
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
