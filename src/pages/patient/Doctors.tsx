
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { 
  PageContainer, 
  PageHeader, 
  PageSection 
} from "@/components/layout/page-container";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, MessageCircle, User, Search } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Doctor {
  id: string;
  full_name: string;
  specialty: string;
  rating?: number;
  patients_count?: number;
  availability?: string[];
}

const fetchDoctors = async (): Promise<Doctor[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'doctor');
    
  if (error) throw error;
  
  // Map to Doctor interface
  return data.map(doctor => ({
    id: doctor.id,
    full_name: doctor.full_name || 'Unknown',
    specialty: doctor.specialty || 'General Medicine',
    rating: 4.5, // Mock data
    patients_count: Math.floor(Math.random() * 100) + 10, // Mock data
    availability: ['Monday', 'Wednesday', 'Friday'] // Mock data
  }));
};

const Doctors: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  
  const { data: doctors = [], isLoading, error } = useQuery({
    queryKey: ['doctors'],
    queryFn: fetchDoctors
  });
  
  // Get unique specialties for filtering
  const specialties = Array.from(new Set(doctors.map(doctor => doctor.specialty)))
    .filter(Boolean)
    .sort();
  
  // Filter doctors based on search term and selected specialty
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.full_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty ? doctor.specialty === selectedSpecialty : true;
    return matchesSearch && matchesSpecialty;
  });

  const handleScheduleAppointment = (doctorId: string) => {
    // In a real app, this would navigate to an appointment scheduling page
    toast.success("Appointment scheduling will be implemented soon!");
  };
  
  return (
    <PageContainer>
      <PageHeader
        title="Find a Doctor"
        description="Connect with healthcare professionals specializing in your area of concern"
        actions={
          <Button variant="outline" onClick={() => navigate("/patient-dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        }
      />
      
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by doctor name"
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Tabs 
          defaultValue="all" 
          className="w-full md:w-auto" 
          onValueChange={(value) => setSelectedSpecialty(value === "all" ? null : value)}
        >
          <TabsList className="w-full md:w-auto grid grid-cols-3 md:grid-cols-5 h-auto">
            <TabsTrigger value="all" className="px-3 py-1.5">All</TabsTrigger>
            {specialties.slice(0, 4).map(specialty => (
              <TabsTrigger key={specialty} value={specialty} className="px-3 py-1.5">
                {specialty}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <p>Loading doctors...</p>
        </div>
      ) : error ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Error loading doctors. Please try again later.</p>
          </CardContent>
        </Card>
      ) : filteredDoctors.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No doctors found matching your criteria.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <Card key={doctor.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>{doctor.full_name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{doctor.full_name}</CardTitle>
                      <CardDescription>{doctor.specialty}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="ml-auto">
                    {doctor.rating} ★
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Patients</span>
                    <span>{doctor.patients_count}+</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Availability</span>
                    <span>{doctor.availability?.join(', ')}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                <Button variant="outline" size="sm" className="w-full sm:w-auto" asChild>
                  <a href="#">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message
                  </a>
                </Button>
                <Button size="sm" className="w-full sm:w-auto" onClick={() => handleScheduleAppointment(doctor.id)}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Appointment
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
};

export default Doctors;
