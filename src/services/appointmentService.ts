
import { supabase } from "@/integrations/supabase/client";

export interface Appointment {
  id?: string;
  doctor_id: string;
  patient_id: string;
  date: string;
  time: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  created_at?: string;
  profiles?: {
    full_name: string;
    specialty?: string;
  } | null;
  patients?: {
    full_name: string;
  } | null;
}

export const createAppointment = async (appointment: Omit<Appointment, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('appointments')
    .insert({
      doctor_id: appointment.doctor_id,
      patient_id: appointment.patient_id,
      date: appointment.date,
      time: appointment.time,
      duration: appointment.duration,
      status: appointment.status,
      notes: appointment.notes
    })
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

export const fetchUserAppointments = async (userId: string, userRole: string) => {
  const roleField = userRole === 'patient' ? 'patient_id' : 'doctor_id';
  
  const { data, error } = await supabase
    .from('appointments')
    .select(`
      *,
      profiles:doctor_id(full_name, specialty),
      patients:patient_id(full_name)
    `)
    .eq(roleField, userId)
    .order('date', { ascending: true })
    .order('time', { ascending: true });
    
  if (error) throw error;
  
  // Process and convert appointments to ensure they match the Appointment type
  return data?.map(appointment => {
    // Ensure status is one of the valid types
    let validStatus: Appointment['status'] = 'pending';
    const status = appointment.status.toLowerCase();
    
    if (status === 'pending' || status === 'confirmed' || 
        status === 'cancelled' || status === 'completed') {
      validStatus = status as Appointment['status'];
    }

    // Create properly typed profiles and patients objects
    let profilesData = null;
    if (appointment.profiles) {
      // Check if it's potentially an error object
      const profilesValue = appointment.profiles;
      if (typeof profilesValue === 'object' && !('error' in profilesValue)) {
        const profile = profilesValue as unknown; // First cast to unknown
        if (profile && typeof profile === 'object') {
          profilesData = {
            full_name: typeof (profile as any).full_name === 'string' ? (profile as any).full_name : "",
            specialty: typeof (profile as any).specialty === 'string' ? (profile as any).specialty : undefined
          };
        }
      }
    }
    
    let patientsData = null;
    if (appointment.patients) {
      // Check if it's potentially an error object
      const patientsValue = appointment.patients;
      if (typeof patientsValue === 'object' && !('error' in patientsValue)) {
        const patient = patientsValue as unknown; // First cast to unknown
        if (patient && typeof patient === 'object') {
          patientsData = {
            full_name: typeof (patient as any).full_name === 'string' ? (patient as any).full_name : ""
          };
        }
      }
    }
    
    // Return properly typed appointment
    return {
      id: appointment.id,
      doctor_id: appointment.doctor_id,
      patient_id: appointment.patient_id,
      date: appointment.date,
      time: appointment.time,
      duration: appointment.duration,
      status: validStatus,
      notes: appointment.notes,
      created_at: appointment.created_at,
      profiles: profilesData,
      patients: patientsData
    } as Appointment;
  }) || [];
};

export const updateAppointmentStatus = async (appointmentId: string, status: Appointment['status']) => {
  const { data, error } = await supabase
    .from('appointments')
    .update({
      status: status
    })
    .eq('id', appointmentId)
    .select()
    .single();
    
  if (error) throw error;
  return data as Appointment;
};
