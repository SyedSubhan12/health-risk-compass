
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
  };
  patients?: {
    full_name: string;
  };
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
    
    // Create properly typed profiles and patients objects with null checks
    // Handle possible SelectQueryError for profiles
    let profilesData = undefined;
    if (appointment.profiles) {
      if (typeof appointment.profiles === 'object' && !('error' in appointment.profiles)) {
        profilesData = {
          full_name: appointment.profiles?.full_name || 'Unknown Doctor',
          specialty: appointment.profiles?.specialty
        };
      }
    }
    
    // Handle possible SelectQueryError for patients
    let patientsData = undefined;
    if (appointment.patients) {
      if (typeof appointment.patients === 'object' && !('error' in appointment.patients)) {
        patientsData = {
          full_name: appointment.patients?.full_name || 'Unknown Patient'
        };
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

export const getAppointmentById = async (appointmentId: string) => {
  const { data, error } = await supabase
    .from('appointments')
    .select(`
      *,
      profiles:doctor_id(full_name, specialty),
      patients:patient_id(full_name)
    `)
    .eq('id', appointmentId)
    .single();
    
  if (error) throw error;
  
  // Handle possible SelectQueryError for profiles and patients
  const appointmentData = data as any;
  
  // Create a correctly typed Appointment object with null checks
  return {
    ...appointmentData,
    profiles: appointmentData.profiles && !('error' in appointmentData.profiles) 
      ? appointmentData.profiles 
      : { full_name: 'Unknown Doctor' },
    patients: appointmentData.patients && !('error' in appointmentData.patients) 
      ? appointmentData.patients 
      : { full_name: 'Unknown Patient' }
  } as Appointment;
};

export const getDoctorPatientConnections = async (doctorId: string) => {
  const { data, error } = await supabase
    .from('appointments')
    .select(`
      patient_id,
      patients:patient_id(full_name)
    `)
    .eq('doctor_id', doctorId);
    
  if (error) throw error;
  
  // Safely handle data that might have parser errors
  return data?.map(item => {
    // Check if item has expected properties
    const patientId = 'patient_id' in item ? item.patient_id : null;
    const patientName = item.patients && 'patients' in item && item.patients && typeof item.patients === 'object' && 'full_name' in item.patients
      ? item.patients.full_name
      : 'Unknown Patient';
      
    return {
      id: patientId,
      name: patientName
    };
  }).filter(item => item.id !== null) || [];
};

export const getPatientDoctorConnections = async (patientId: string) => {
  const { data, error } = await supabase
    .from('appointments')
    .select(`
      doctor_id,
      profiles:doctor_id(full_name, specialty)
    `)
    .eq('patient_id', patientId);
    
  if (error) throw error;
  
  // Safely handle data that might have parser errors
  return data?.map(item => {
    // Check if item has expected properties
    const doctorId = 'doctor_id' in item ? item.doctor_id : null;
    const doctorInfo = 'profiles' in item && item.profiles && typeof item.profiles === 'object';
    
    return {
      id: doctorId,
      name: doctorInfo && item.profiles && 'full_name' in item.profiles ? item.profiles.full_name : 'Unknown Doctor',
      specialty: doctorInfo && item.profiles && 'specialty' in item.profiles ? item.profiles.specialty : undefined
    };
  }).filter(item => item.id !== null) || [];
};
