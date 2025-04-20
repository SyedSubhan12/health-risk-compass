
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { createAppointment } from "@/services/appointmentService";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AppointmentFormProps {
  doctorId: string;
  doctorName: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
];

export function AppointmentForm({ doctorId, doctorName, onSuccess, onCancel }: AppointmentFormProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string | undefined>(undefined);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) {
    return <div>Please log in to schedule an appointment</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !time) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select both date and time for the appointment",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      await createAppointment({
        doctor_id: doctorId,
        patient_id: user.id,
        date: format(date, "yyyy-MM-dd"),
        time,
        duration: 30, // 30 minutes appointment by default
        status: "pending",
        notes,
      });
      
      toast({
        title: "Appointment Scheduled",
        description: `Your appointment with Dr. ${doctorName} on ${format(date, "MMM dd, yyyy")} at ${time} has been scheduled.`,
      });
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/patient-dashboard");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: (error as Error).message || "Failed to schedule appointment",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Schedule Appointment</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Doctor</p>
            <p className="font-medium">{doctorName}</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Select Date</p>
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-left font-normal"
                  type="button"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "MMMM d, yyyy") : "Select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(date) => {
                    // Disable past dates and weekends
                    const now = new Date();
                    now.setHours(0, 0, 0, 0);
                    const day = date.getDay();
                    return date < now || day === 0 || day === 6;
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Select Time</p>
            <Select onValueChange={setTime}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select time">
                  {time ? (
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      {time}
                    </div>
                  ) : (
                    "Select a time"
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map(slot => (
                  <SelectItem key={slot} value={slot}>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      {slot}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Notes (optional)</p>
            <Textarea 
              placeholder="Add any notes or symptoms you'd like to discuss"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting || !date || !time}
          >
            Schedule Appointment
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
