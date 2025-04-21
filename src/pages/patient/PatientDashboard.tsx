import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  PageContainer, 
  PageHeader, 
  PageSection 
} from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, RocketIcon, User2Icon, BrainCircuit, Stethoscope } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

export default function PatientDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      title: "Health Assessment",
      description: "Get personalized health risk predictions and recommendations",
      icon: Stethoscope,
      path: "/health-assessment",
      color: "bg-health-primary/10 text-health-primary"
    },
    {
      title: "Book Appointment",
      description: "Schedule appointments with healthcare professionals",
      icon: CalendarIcon,
      path: "/book-appointment",
      color: "bg-blue-500/10 text-blue-500"
    },
    {
      title: "Manage Profile",
      description: "Update your personal information and preferences",
      icon: User2Icon,
      path: "/profile",
      color: "bg-green-500/10 text-green-500"
    }
  ];

  return (
    <PageContainer>
      <PageHeader
        title={`Welcome back, ${user?.name || "Patient"}!`}
        description="Your personalized dashboard for managing appointments and health insights"
      />

      <PageSection>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className="h-full cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate(feature.path)}
                >
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-full ${feature.color} flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button variant="ghost" className="w-full">
                      Get Started
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </PageSection>
    </PageContainer>
  );
}
