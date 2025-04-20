
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PageContainer, PageHeader, PageSection } from "@/components/layout/page-container";
import { HealthCard } from "@/components/ui/health-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskIndicator } from "@/components/ui/risk-indicator";
import { 
  Heart, 
  Droplet, 
  Activity, 
  UserPlus, 
  History, 
  MessageCircle,
  Weight,
  User,
} from "lucide-react";
import { 
  mockPatientProfile, 
  mockDoctors, 
  mockPastPredictions 
} from "@/data/mockData";

export default function PatientDashboard() {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState("overview");
  
  // Map risk types to appropriate icons
  const getRiskIcon = (type: string) => {
    switch (type) {
      case "diabetes":
        return <Droplet className="h-5 w-5" />;
      case "heartDisease":
        return <Heart className="h-5 w-5" />;
      case "hypertension":
        return <Activity className="h-5 w-5" />;
      case "obesity":
        return <Weight className="h-5 w-5" />;
      default:
        return <Activity className="h-5 w-5" />;
    }
  };

  const formatRiskType = (type: string) => {
    switch (type) {
      case "heartDisease":
        return "Heart Disease";
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  return (
    <PageContainer>
      <PageHeader 
        title={`Hello, ${user?.name || 'Patient'}`}
        description="Here's an overview of your health risks and recommendations"
        actions={
          <Button asChild>
            <Link to="/patient-prediction">New Prediction</Link>
          </Button>
        }
      />

      <div className="flex flex-wrap mb-6 gap-2">
        <Button 
          variant={selectedTab === "overview" ? "default" : "outline"}
          onClick={() => setSelectedTab("overview")}
        >
          Overview
        </Button>
        <Button 
          variant={selectedTab === "doctors" ? "default" : "outline"}
          onClick={() => setSelectedTab("doctors")}
        >
          Find Doctor
        </Button>
        <Button 
          variant={selectedTab === "history" ? "default" : "outline"}
          onClick={() => setSelectedTab("history")}
        >
          History
        </Button>
        <Button 
          variant={selectedTab === "messages" ? "default" : "outline"}
          onClick={() => setSelectedTab("messages")}
        >
          Messages
        </Button>
      </div>

      {selectedTab === "overview" && (
        <>
          <PageSection title="Your Health Risk Scores">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockPatientProfile.healthRisks.map((risk) => (
                <HealthCard
                  key={risk.id}
                  title={formatRiskType(risk.type)}
                  value={risk.score}
                  maxValue={risk.maxScore}
                  riskLevel={risk.level}
                  icon={getRiskIcon(risk.type)}
                  recommendation={risk.recommendation}
                />
              ))}
            </div>
          </PageSection>

          <PageSection title="Recent Measurements">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Health Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Blood Pressure</span>
                    <span className="text-lg font-semibold">{mockPatientProfile.recentMeasurements.bloodPressure}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Glucose</span>
                    <span className="text-lg font-semibold">{mockPatientProfile.recentMeasurements.glucoseLevel} mg/dL</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Cholesterol</span>
                    <span className="text-lg font-semibold">{mockPatientProfile.recentMeasurements.cholesterol} mg/dL</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">BMI</span>
                    <span className="text-lg font-semibold">{mockPatientProfile.recentMeasurements.bmi}</span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-accent rounded-md text-sm">
                  <p className="font-medium">Recommendation:</p>
                  <p>{mockPatientProfile.generalRecommendation}</p>
                </div>
              </CardContent>
            </Card>
          </PageSection>
        </>
      )}

      {selectedTab === "doctors" && (
        <PageSection title="Available Doctors" description="Select a doctor to manage your health">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockDoctors.map((doctor) => (
              <Card key={doctor.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center overflow-hidden">
                      <User className="h-6 w-6 text-accent-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{doctor.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm">{doctor.bio}</p>
                    <div className="flex items-center">
                      <span className="text-sm text-yellow-500 mr-1">★</span>
                      <span className="text-sm font-medium">{doctor.rating}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{doctor.availability}</p>
                  </div>
                  <Button variant="outline" className="w-full">Select as Doctor</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </PageSection>
      )}

      {selectedTab === "history" && (
        <PageSection title="Prediction History" description="Your past health risk assessments">
          <div className="space-y-4">
            {mockPastPredictions.map((prediction) => (
              <Card key={prediction.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Assessment: {prediction.date}</CardTitle>
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {prediction.healthRisks.map((risk) => (
                      <div key={`${prediction.id}-${risk.type}`} className="flex items-center gap-2">
                        <RiskIndicator level={risk.level} score={risk.score} label={formatRiskType(risk.type)} />
                      </div>
                    ))}
                  </div>
                  {prediction.doctorNote && (
                    <div className="mt-3 p-3 bg-accent rounded-md">
                      <p className="text-sm font-medium">Doctor's Note:</p>
                      <p className="text-sm">{prediction.doctorNote}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </PageSection>
      )}

      {selectedTab === "messages" && (
        <PageSection title="Messages" description="Communicate with your healthcare provider">
          <Card className="min-h-[400px] flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Your Messages</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center items-center p-6 text-center">
              <MessageCircle className="w-12 h-12 text-muted-foreground mb-3" />
              <h3 className="text-lg font-medium mb-2">No messages yet</h3>
              <p className="text-muted-foreground mb-4">Select a doctor first to start messaging.</p>
              <Button onClick={() => setSelectedTab("doctors")}>
                Find a Doctor
              </Button>
            </CardContent>
          </Card>
        </PageSection>
      )}
    </PageContainer>
  );
}
