import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  PageContainer, 
  PageHeader, 
  PageSection 
} from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, RocketIcon, User2Icon, BrainCircuit } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function PatientDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <PageContainer>
      <PageHeader
        title={`Welcome back, ${user?.name || "Patient"}!`}
        description="Your personalized dashboard for managing appointments and health insights"
      />

      <PageSection title="Quick Actions">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Book Appointment</CardTitle>
              <CardDescription>
                Schedule your next consultation with ease
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CalendarIcon className="w-8 h-8 text-primary mr-2" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Find a suitable time slot and book your appointment
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => navigate("/patient-prediction")}>
                Book Now
              </Button>
            </CardFooter>
          </Card>

          <Card className="col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Health Risk Assessment</CardTitle>
              <CardDescription>
                Understand your potential health risks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <RocketIcon className="w-8 h-8 text-primary mr-2" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Take our assessment to get a personalized risk report
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => navigate("/patient-prediction")}>
                Start Assessment
              </Button>
            </CardFooter>
          </Card>

          <Card className="col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">ML Model Predictions</CardTitle>
              <CardDescription>
                Try our machine learning models for health predictions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <BrainCircuit className="w-8 h-8 text-primary mr-2" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Generate predictions using various ML models
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => navigate("/model-prediction")}>
                Try Models
              </Button>
            </CardFooter>
          </Card>

          <Card className="col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Manage Profile</CardTitle>
              <CardDescription>
                Update your personal and health information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <User2Icon className="w-8 h-8 text-primary mr-2" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Keep your profile up-to-date for better recommendations
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => navigate("/patient-prediction")}>
                Edit Profile
              </Button>
            </CardFooter>
          </Card>
        </div>
      </PageSection>
    </PageContainer>
  );
}
