
import { supabase } from "@/integrations/supabase/client";

export interface Appointment {
  id?: string;
  doctor_id: string;
  patient_id: string;
  date: string;
  time: string;
  duration: number; // in minutes
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  created_at?: string;
}

export const createAppointment = async (appointment: Omit<Appointment, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('appointments')
    .insert(appointment)
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

export const fetchUserAppointments = async (userId: string, userRole: string) => {
  const roleField = userRole === 'patient' ? 'patient_id' : 'doctor_id';
  
  const { data, error } = await supabase
    .from('appointments')
    .select('*, profiles!appointments_doctor_id_fkey(full_name, specialty), patients:profiles!appointments_patient_id_fkey(full_name)')
    .eq(roleField, userId)
    .order('date', { ascending: true })
    .order('time', { ascending: true });
    
  if (error) throw error;
  return data;
};

export const updateAppointmentStatus = async (appointmentId: string, status: Appointment['status']) => {
  const { data, error } = await supabase
    .from('appointments')
    .update({ status })
    .eq('id', appointmentId)
    .select()
    .single();
    
  if (error) throw error;
  return data;
};
