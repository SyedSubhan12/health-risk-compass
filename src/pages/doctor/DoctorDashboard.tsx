
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PageContainer, PageHeader, PageSection } from "@/components/layout/page-container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RiskIndicator } from "@/components/ui/risk-indicator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Bell, 
  Search, 
  FileText, 
  BarChart, 
  Download,
  MessageCircle,
  Calendar,
  User
} from "lucide-react";
import { MessageCenter } from "@/components/messaging/message-center";
import { AppointmentList } from "@/components/appointments/AppointmentList";

import { mockPatientsList } from "@/data/mockData";

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Filter patients based on search term
  const filteredPatients = mockPatientsList.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Get selected patient data
  const activePatient = mockPatientsList.find(patient => patient.id === selectedPatient);
  
  // Stats for the overview panel
  const stats = {
    totalPatients: mockPatientsList.length,
    newResults: mockPatientsList.filter(p => p.hasNewResults).length,
    highRiskPatients: mockPatientsList.filter(p => p.highestRisk.level === "high").length
  };

  return (
    <PageContainer>
      <PageHeader 
        title={`Welcome, ${user?.name || 'Doctor'}`}
        description="Manage your patients and monitor their health risks"
        actions={
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {stats.newResults > 0 && (
                <span className="absolute -top-1 -right-1 bg-destructive text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {stats.newResults}
                </span>
              )}
            </Button>
            <Button asChild>
              <Link to="/doctor-insights">View Insights</Link>
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Your Patients</CardTitle>
                <Badge className="ml-2">{stats.totalPatients}</Badge>
              </div>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search patients" 
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="max-h-[400px] overflow-y-auto space-y-2">
              {filteredPatients.length > 0 ? (
                filteredPatients.map(patient => (
                  <div 
                    key={patient.id}
                    className={`flex items-center space-x-3 p-2 rounded-md cursor-pointer ${
                      selectedPatient === patient.id ? 'bg-accent' : 'hover:bg-muted'
                    }`}
                    onClick={() => setSelectedPatient(patient.id)}
                  >
                    <Avatar>
                      <AvatarFallback>{patient.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="font-medium truncate">{patient.name}</p>
                        {patient.hasNewResults && (
                          <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">New</Badge>
                        )}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span>{patient.age} yrs</span>
                        <span className="mx-1">•</span>
                        <RiskIndicator level={patient.highestRisk.level} label={patient.highestRisk.type} showValue={false} />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-4 text-muted-foreground">
                  No patients found
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">At a Glance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-accent rounded-md">
                <div className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span>Total Patients</span>
                </div>
                <Badge variant="secondary">{stats.totalPatients}</Badge>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-accent rounded-md">
                <div className="flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span>New Results</span>
                </div>
                <Badge variant="secondary">{stats.newResults}</Badge>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-accent rounded-md">
                <div className="flex items-center">
                  <RiskIndicator level="high" showValue={false} className="mr-2" />
                  <span>High Risk Patients</span>
                </div>
                <Badge variant="secondary">{stats.highRiskPatients}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Tabs defaultValue="patients" className="mb-6">
            <TabsList className="w-full">
              <TabsTrigger value="patients" className="flex-1">
                Patient Management
              </TabsTrigger>
              <TabsTrigger value="messages" className="flex-1">
                Messages
              </TabsTrigger>
              <TabsTrigger value="appointments" className="flex-1">
                Appointments
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="patients">
              {selectedPatient && activePatient ? (
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>{activePatient.name}</CardTitle>
                        <CardDescription>
                          {activePatient.age} years old • Last checkup: {activePatient.lastCheckup}
                        </CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Calendar className="h-4 w-4 mr-2" />
                          Schedule
                        </Button>
                        <Button size="sm">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="w-full">
                        <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
                        <TabsTrigger value="records" className="flex-1">Medical Records</TabsTrigger>
                        <TabsTrigger value="notes" className="flex-1">Clinical Notes</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="overview" className="space-y-4 pt-4">
                        <div className="bg-accent p-4 rounded-md">
                          <h3 className="font-medium mb-2">Highest Risk Factor</h3>
                          <div className="flex items-center">
                            <RiskIndicator 
                              level={activePatient.highestRisk.level} 
                              label={activePatient.highestRisk.type} 
                            />
                          </div>
                        </div>

                        {/* Quick metrics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="p-3 bg-muted rounded-md">
                            <p className="text-sm text-muted-foreground">BMI</p>
                            <p className="text-lg font-semibold">24.5</p>
                          </div>
                          <div className="p-3 bg-muted rounded-md">
                            <p className="text-sm text-muted-foreground">Blood Pressure</p>
                            <p className="text-lg font-semibold">120/80</p>
                          </div>
                          <div className="p-3 bg-muted rounded-md">
                            <p className="text-sm text-muted-foreground">Glucose</p>
                            <p className="text-lg font-semibold">95 mg/dL</p>
                          </div>
                          <div className="p-3 bg-muted rounded-md">
                            <p className="text-sm text-muted-foreground">Cholesterol</p>
                            <p className="text-lg font-semibold">180 mg/dL</p>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="records" className="space-y-4 pt-4">
                        <div className="flex justify-between items-center p-3 bg-accent rounded-md">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 mr-2" />
                            <div>
                              <p className="font-medium">Health Risk Assessment</p>
                              <p className="text-sm text-muted-foreground">{activePatient.lastCheckup}</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">View</Button>
                        </div>
                        
                        <div className="flex justify-between items-center p-3 bg-accent rounded-md">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 mr-2" />
                            <div>
                              <p className="font-medium">Lab Results</p>
                              <p className="text-sm text-muted-foreground">3 months ago</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">View</Button>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="notes" className="space-y-4 pt-4">
                        <div>
                          <Textarea 
                            placeholder="Enter your medical observations and recommendations..." 
                            className="min-h-[150px]" 
                          />
                          <Button className="mt-2">Save Note</Button>
                        </div>
                        
                        <div className="p-3 bg-accent rounded-md">
                          <div className="flex justify-between mb-1">
                            <p className="font-medium">Previous Note</p>
                            <span className="text-xs text-muted-foreground">2 weeks ago</span>
                          </div>
                          <p className="text-sm">
                            Patient reports occasional chest pain. Recommended lifestyle changes and 
                            scheduled follow-up appointment in 3 weeks.
                          </p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              ) : (
                <Card className="h-full flex flex-col items-center justify-center text-center p-10">
                  <User className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Patient Selected</h3>
                  <p className="text-muted-foreground max-w-sm mb-6">
                    Select a patient from the list to view their health details and risk assessments
                  </p>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="messages">
              <PageSection title="Messages" description="Communicate with your patients">
                <MessageCenter />
              </PageSection>
            </TabsContent>
            
            <TabsContent value="appointments">
              <PageSection title="Appointments" description="Manage your patient appointments">
                <AppointmentList />
              </PageSection>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageContainer>
  );
}
