
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Calendar, Clock } from "lucide-react";
import { fetchUserAppointments, updateAppointmentStatus } from "@/services/appointmentService";
import { format, parseISO } from "date-fns";

interface AppointmentData {
  id: string;
  doctor_id: string;
  patient_id: string;
  date: string;
  time: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  created_at: string;
  profiles: { full_name: string; specialty?: string };
  patients: { full_name: string };
}

export function AppointmentList() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadAppointments();
    }
  }, [user]);

  const loadAppointments = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await fetchUserAppointments(user.id, user.role || 'patient');
      setAppointments(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load appointments"
      });
      console.error("Error loading appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (appointmentId: string, status: AppointmentData['status']) => {
    try {
      await updateAppointmentStatus(appointmentId, status);
      
      // Update local state
      setAppointments(prev => 
        prev.map(appointment => 
          appointment.id === appointmentId 
            ? { ...appointment, status } 
            : appointment
        )
      );
      
      toast({
        title: "Appointment Updated",
        description: `Appointment has been ${status}`
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update appointment"
      });
    }
  };

  const getStatusBadge = (status: AppointmentData['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'confirmed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Confirmed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Completed</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p>Loading appointments...</p>
        </CardContent>
      </Card>
    );
  }

  if (appointments.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Calendar className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-lg font-medium mb-2">No appointments</h3>
          <p className="text-muted-foreground mb-4">
            {user?.role === 'patient' 
              ? "You don't have any scheduled appointments yet" 
              : "You don't have any patient appointments scheduled"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map(appointment => {
        const isPatient = user?.role === 'patient';
        const otherPersonName = isPatient 
          ? appointment.profiles.full_name 
          : appointment.patients.full_name;
        
        return (
          <Card key={appointment.id} className="overflow-hidden">
            <CardHeader className="pb-3 bg-muted/30">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">
                  {isPatient ? 'Appointment with Dr.' : 'Patient:'} {otherPersonName}
                </CardTitle>
                {getStatusBadge(appointment.status)}
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center text-sm">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Date: {format(parseISO(appointment.date), "MMMM d, yyyy")}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Time: {appointment.time}</span>
                  </div>
                </div>
                <div>
                  {appointment.notes && (
                    <div className="text-sm">
                      <p className="font-medium">Notes:</p>
                      <p className="text-muted-foreground">{appointment.notes}</p>
                    </div>
                  )}
                </div>
              </div>
              
              {appointment.status === 'pending' && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {user?.role === 'doctor' && (
                    <Button 
                      size="sm" 
                      onClick={() => handleUpdateStatus(appointment.id, 'confirmed')}
                    >
                      Confirm
                    </Button>
                  )}
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleUpdateStatus(appointment.id, 'cancelled')}
                  >
                    Cancel
                  </Button>
                </div>
              )}
              
              {appointment.status === 'confirmed' && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {user?.role === 'doctor' && (
                    <Button 
                      size="sm" 
                      onClick={() => handleUpdateStatus(appointment.id, 'completed')}
                    >
                      Mark Completed
                    </Button>
                  )}
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleUpdateStatus(appointment.id, 'cancelled')}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
