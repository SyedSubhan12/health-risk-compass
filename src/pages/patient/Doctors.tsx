
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageContainer, PageHeader } from "@/components/layout/page-container";
import { DoctorCard } from "@/components/doctor/doctor-card";
import { mockPatientsList } from "@/data/mockData";
import { User } from "lucide-react";

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
];

const DoctorsPage: React.FC = () => {
  return (
    <PageContainer>
      <PageHeader
        title="Available Doctors"
        description="Discover and connect with medical experts"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {mockDoctors.map((doctor) => (
          <DoctorCard
            key={doctor.id}
            id={doctor.id}
            name={doctor.name}
            specialty={doctor.specialty}
            bio={doctor.bio}
            rating={doctor.rating}
            availability={doctor.availability}
            onSelect={() => {
              // Example: future logic to select doctor
            }}
          />
        ))}
      </div>
    </PageContainer>
  );
};
export default DoctorsPage;
