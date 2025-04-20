
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchUserAppointments, updateAppointmentStatus, Appointment } from "@/services/appointmentService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, User, Check, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

export function AppointmentList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadAppointments = async () => {
      if (!user?.id || !user?.role) {
        setLoading(false);
        return;
      }
      
      try {
        const appointmentsData = await fetchUserAppointments(user.id, user.role);
        setAppointments(appointmentsData);
      } catch (error) {
        console.error("Error loading appointments:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load appointments. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, [user]);

  const handleStatusUpdate = async (appointmentId: string, newStatus: Appointment['status']) => {
    try {
      await updateAppointmentStatus(appointmentId, newStatus);
      
      // Update the local state
      setAppointments(appointments.map(appointment => 
        appointment.id === appointmentId 
          ? { ...appointment, status: newStatus } 
          : appointment
      ));
      
      toast({
        title: "Status Updated",
        description: `Appointment status changed to ${newStatus}`,
      });
    } catch (error) {
      console.error("Error updating appointment status:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update appointment status. Please try again.",
      });
    }
  };

  const getStatusBadgeClass = (status: Appointment['status']) => {
    switch(status) {
      case 'confirmed': return "bg-green-100 text-green-800";
      case 'pending': return "bg-yellow-100 text-yellow-800";
      case 'cancelled': return "bg-red-100 text-red-800";
      case 'completed': return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100";
    }
  };

  if (loading) {
    return <div className="flex justify-center p-4">Loading appointments...</div>;
  }

  return (
    <div className="space-y-4">
      {appointments.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No appointments found.</p>
            {user?.role === 'patient' && (
              <Button className="mt-4">Schedule New Appointment</Button>
            )}
          </CardContent>
        </Card>
      ) : (
        appointments.map((appointment) => (
          <Card key={appointment.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">
                  {user?.role === 'patient' 
                    ? `Dr. ${appointment.profiles?.full_name || 'Unknown'}`
                    : `Patient: ${appointment.patients?.full_name || 'Unknown'}`}
                </CardTitle>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(appointment.status)}`}>
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>
                    {appointment.date}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{appointment.time} ({appointment.duration} minutes)</span>
                </div>
                {appointment.notes && (
                  <div className="text-sm mt-2 p-2 bg-muted rounded-md">
                    <p className="font-medium">Notes:</p>
                    <p>{appointment.notes}</p>
                  </div>
                )}
                
                {/* Action buttons based on role and status */}
                {appointment.status === 'pending' && (
                  <div className="flex space-x-2 mt-3">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleStatusUpdate(appointment.id!, 'confirmed')}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Confirm
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleStatusUpdate(appointment.id!, 'cancelled')}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
                
                {appointment.status === 'confirmed' && (
                  <div className="flex space-x-2 mt-3">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleStatusUpdate(appointment.id!, 'completed')}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Mark Completed
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleStatusUpdate(appointment.id!, 'cancelled')}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
