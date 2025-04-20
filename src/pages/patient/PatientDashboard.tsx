import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PageContainer, PageHeader, PageSection } from "@/components/layout/page-container";
import { HealthCard } from "@/components/ui/health-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Heart, 
  Droplet, 
  Activity, 
  UserPlus, 
  History, 
  MessageCircle,
  Weight,
  User,
  Calendar
} from "lucide-react";
import { 
  mockPatientProfile, 
  mockDoctors, 
  mockPastPredictions 
} from "@/data/mockData";
import { DoctorCard } from "@/components/doctor/doctor-card";
import { PredictionHistoryCard } from "@/components/patient/prediction-history-card";
import { MessageCenter } from "@/components/messaging/message-center";

export default function PatientDashboard() {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState("overview");
  
  // Mock data for messaging system
  const [activeContactId, setActiveContactId] = useState<string | undefined>(
    mockDoctors.length > 0 ? mockDoctors[0].id : undefined
  );
  const [messages, setMessages] = useState<any[]>([]);

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

  const handleSendMessage = (text: string) => {
    const newMessage = {
      id: `msg-${Date.now()}`,
      senderId: user?.id || "",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };
    setMessages([...messages, newMessage]);
  };

  const handleSelectDoctor = (doctorId: string) => {
    // This would update the user's selected doctor in a real app
    console.log(`Selected doctor with ID: ${doctorId}`);
  };

  // Format doctors for message contacts
  const messageContacts = mockDoctors.map(doctor => ({
    id: doctor.id,
    name: doctor.name,
    role: doctor.specialty,
    isActive: doctor.id === activeContactId
  }));

  return (
    <PageContainer>
      <PageHeader 
        title={`Hello, ${user?.name || 'Patient'}`}
        description="Monitor your health risks and get personalized recommendations"
        actions={
          <Button asChild>
            <Link to="/patient-prediction">New Prediction</Link>
          </Button>
        }
      />

      <div className="mb-6 border-b">
        <div className="flex overflow-x-auto space-x-1">
          <Button 
            variant={selectedTab === "overview" ? "default" : "ghost"}
            onClick={() => setSelectedTab("overview")}
            className="rounded-none border-b-2 border-transparent px-4 py-1 hover:border-primary data-[active]:border-primary"
            data-active={selectedTab === "overview"}
          >
            Overview
          </Button>
          <Button 
            variant={selectedTab === "doctors" ? "default" : "ghost"}
            onClick={() => setSelectedTab("doctors")}
            className="rounded-none border-b-2 border-transparent px-4 py-1 hover:border-primary data-[active]:border-primary"
            data-active={selectedTab === "doctors"}
          >
            Find Doctor
          </Button>
          <Button 
            variant={selectedTab === "history" ? "default" : "ghost"}
            onClick={() => setSelectedTab("history")}
            className="rounded-none border-b-2 border-transparent px-4 py-1 hover:border-primary data-[active]:border-primary"
            data-active={selectedTab === "history"}
          >
            History
          </Button>
          <Button 
            variant={selectedTab === "messages" ? "default" : "ghost"}
            onClick={() => setSelectedTab("messages")}
            className="rounded-none border-b-2 border-transparent px-4 py-1 hover:border-primary data-[active]:border-primary"
            data-active={selectedTab === "messages"}
          >
            Messages
          </Button>
        </div>
      </div>

      {selectedTab === "overview" && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="col-span-1 lg:col-span-2">
              <PageSection title="Your Health Risk Scores">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
            
            <div className="col-span-1">
              <PageSection title="Your Doctor">
                {mockPatientProfile.assignedDoctor ? (
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center overflow-hidden">
                          <User className="h-6 w-6 text-accent-foreground" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{mockPatientProfile.assignedDoctor.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{mockPatientProfile.assignedDoctor.specialty}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <span className="text-sm text-yellow-500">★</span>
                          <span className="text-sm font-medium">{mockPatientProfile.assignedDoctor.rating}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{mockPatientProfile.assignedDoctor.availability}</span>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Button size="sm" className="w-full" asChild>
                          <Link to="#">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Message
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" className="w-full" asChild>
                          <Link to="#">
                            <Calendar className="h-4 w-4 mr-2" />
                            Schedule
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                      <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                        <UserPlus className="h-6 w-6 text-accent-foreground" />
                      </div>
                      <div>
                        <h3 className="font-medium">No doctor assigned</h3>
                        <p className="text-sm text-muted-foreground">Choose a doctor to help manage your health</p>
                      </div>
                      <Button className="w-full" onClick={() => setSelectedTab("doctors")}>
                        Find a Doctor
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </PageSection>
              
              <PageSection title="Upcoming Appointments">
                <Card>
                  <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
                    <Calendar className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium">No upcoming appointments</h3>
                      <p className="text-sm text-muted-foreground">Schedule an appointment with your doctor</p>
                    </div>
                    <Button variant="outline" className="w-full" disabled={!mockPatientProfile.assignedDoctor}>
                      Schedule Appointment
                    </Button>
                  </CardContent>
                </Card>
              </PageSection>
            </div>
          </div>
        </>
      )}

      {selectedTab === "doctors" && (
        <PageSection title="Available Doctors" description="Select a doctor to manage your health">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockDoctors.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                id={doctor.id}
                name={doctor.name}
                specialty={doctor.specialty}
                bio={doctor.bio}
                rating={doctor.rating}
                availability={doctor.availability}
                onSelect={() => handleSelectDoctor(doctor.id)}
              />
            ))}
          </div>
        </PageSection>
      )}

      {selectedTab === "history" && (
        <PageSection title="Prediction History" description="Your past health risk assessments">
          <div className="space-y-4">
            {mockPastPredictions.map((prediction) => (
              <PredictionHistoryCard
                key={prediction.id}
                id={prediction.id}
                date={prediction.date}
                healthRisks={prediction.healthRisks}
                doctorNote={prediction.doctorNote}
                onViewDetails={() => console.log(`View details for prediction ${prediction.id}`)}
              />
            ))}
          </div>
        </PageSection>
      )}

      {selectedTab === "messages" && (
        <PageSection title="Messages" description="Communicate with your healthcare provider">
          <MessageCenter
            contacts={messageContacts}
            messages={messages}
            activeContactId={activeContactId}
            onSelectContact={setActiveContactId}
            onSendMessage={handleSendMessage}
          />
        </PageSection>
      )}
    </PageContainer>
  );
}
