
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageContainer, PageHeader } from "@/components/layout/page-container";
import { DoctorCard } from "@/components/doctor/doctor-card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { User, ArrowLeft, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

// Mock doctor list (replace with actual fetch if Supabase is ready)
const mockDoctors = [
  {
    id: "doctor-1",
    name: "Dr. Sophia Smith",
    specialty: "Endocrinologist",
    bio: "Specialist in diabetes and metabolic disorders.",
    rating: 4.8,
    availability: "Mon-Fri",
  },
  {
    id: "doctor-2",
    name: "Dr. Liam Johnson",
    specialty: "Cardiologist",
    bio: "Expert in heart disease prevention and treatment.",
    rating: 4.7,
    availability: "Tue-Thu",
  },
  {
    id: "doctor-3",
    name: "Dr. Olivia Lee",
    specialty: "Neurologist",
    bio: "Focused on stroke recovery and brain health.",
    rating: 4.9,
    availability: "Wed-Fri",
  },
  {
    id: "doctor-4",
    name: "Dr. Thomas Wilson",
    specialty: "General Practitioner",
    bio: "Providing comprehensive preventive care for all ages.",
    rating: 4.6,
    availability: "Mon-Wed, Fri",
  },
  {
    id: "doctor-5",
    name: "Dr. Emily Chen",
    specialty: "Endocrinologist",
    bio: "Specializing in managing complex diabetic conditions.",
    rating: 4.8,
    availability: "Mon, Wed, Fri",
  },
  {
    id: "doctor-6",
    name: "Dr. Michael Rivera",
    specialty: "Cardiologist",
    bio: "Heart health expert with focus on preventive cardiology.",
    rating: 4.5,
    availability: "Tue-Sat",
  },
];

const DoctorsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  
  // Get unique specialties for filter
  const specialties = Array.from(new Set(mockDoctors.map(doctor => doctor.specialty)));
  
  // Filter doctors based on search and specialty
  const filteredDoctors = mockDoctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doctor.bio.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialty = selectedSpecialty ? doctor.specialty === selectedSpecialty : true;
    
    return matchesSearch && matchesSpecialty;
  });

  const handleDoctorSelect = (doctorId: string) => {
    // Future implementation: Navigate to doctor detail or booking page
    toast.success(`Selected Dr. ${mockDoctors.find(d => d.id === doctorId)?.name.split(' ')[1]}`);
    // Navigate to a doctor detail page in future
    // navigate(`/doctors/${doctorId}`);
  };

  return (
    <PageContainer>
      <PageHeader
        title="Find a Doctor"
        description="Connect with healthcare professionals specialized in your needs"
        actions={
          <Button variant="outline" onClick={() => navigate("/patient-dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        }
      />
      
      {/* Search and filter section */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, specialty, or keyword"
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {specialties.map(specialty => (
            <Button
              key={specialty}
              variant={selectedSpecialty === specialty ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setSelectedSpecialty(selectedSpecialty === specialty ? null : specialty);
              }}
            >
              {specialty}
            </Button>
          ))}
          {selectedSpecialty && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setSelectedSpecialty(null)}
            >
              Clear
            </Button>
          )}
        </div>
      </div>
      
      {/* Doctors grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              id={doctor.id}
              name={doctor.name}
              specialty={doctor.specialty}
              bio={doctor.bio}
              rating={doctor.rating}
              availability={doctor.availability}
              onSelect={() => handleDoctorSelect(doctor.id)}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <User className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No doctors found</h3>
            <p className="text-muted-foreground mt-2">
              Try adjusting your search criteria or removing filters
            </p>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default DoctorsPage;
