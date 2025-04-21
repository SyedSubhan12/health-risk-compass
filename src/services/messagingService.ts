import { supabase } from "@/integrations/supabase/client";

// Types for messages and contacts
export interface MessageData {
  id?: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at?: string;
  read_at?: string | null;
}

export interface ContactWithMessages {
  id: string;
  name: string;
  role: string;
  specialty?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unread?: boolean;
}

// Function to send a message
export const sendMessage = async (receiverId: string, content: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error("You must be logged in to send messages");
  
  const newMessage = {
    sender_id: user.id,
    receiver_id: receiverId,
    content,
  };
  
  const { data, error } = await supabase
    .from('messages')
    .insert(newMessage)
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

// Function to fetch messages between two users
export const fetchMessages = async (otherUserId: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error("You must be logged in to view messages");
  
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
    .or(`sender_id.eq.${otherUserId},receiver_id.eq.${otherUserId}`)
    .order('created_at', { ascending: true });
    
  if (error) throw error;
  
  return data.map((message: MessageData) => ({
    id: message.id,
    senderId: message.sender_id,
    text: message.content,
    timestamp: new Date(message.created_at!).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
    isMe: message.sender_id === user.id,
  }));
};

// Function to mark messages as read
export const markMessagesAsRead = async (senderId: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return;
  
  const { error } = await supabase
    .from('messages')
    .update({ read_at: new Date().toISOString() })
    .match({ sender_id: senderId, receiver_id: user.id, read_at: null });
    
  if (error) console.error("Error marking messages as read:", error);
};

// Function to fetch user contacts
export const fetchContacts = async (userRole: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error("You must be logged in to view contacts");
  
  // Begin by getting the user's connections from appointments
  let contactIds: string[] = [];
  
  if (userRole === 'patient') {
    // Get doctors this patient has appointments with
    const { data: doctorConnections, error: doctorError } = await supabase
      .from('appointments')
      .select('doctor_id')
      .eq('patient_id', user.id);
    
    if (doctorError) throw doctorError;
    
    // Filter out any items that don't have doctor_id property or have parsing errors
    contactIds = doctorConnections
      .filter(conn => conn && typeof conn === 'object' && 'doctor_id' in conn)
      .map(conn => conn.doctor_id);
  } else {
    // Get patients this doctor has appointments with
    const { data: patientConnections, error: patientError } = await supabase
      .from('appointments')
      .select('patient_id')
      .eq('doctor_id', user.id);
    
    if (patientError) throw patientError;
    
    // Filter out any items that don't have patient_id property or have parsing errors
    contactIds = patientConnections
      .filter(conn => conn && typeof conn === 'object' && 'patient_id' in conn)
      .map(conn => conn.patient_id);
  }
  
  // If no connections, try to get all potential contacts based on role
  if (contactIds.length === 0) {
    let query;
    
    if (userRole === 'patient') {
      // Patients see doctors
      query = supabase
        .from('profiles')
        .select('*')
        .eq('role', 'doctor');
    } else {
      // Doctors see patients
      query = supabase
        .from('profiles')
        .select('*')
        .eq('role', 'patient');
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // Process the contacts data
    const contacts: ContactWithMessages[] = data.map((contact: any) => ({
      id: contact.id,
      name: contact.full_name || 'Unknown',
      role: contact.role || (userRole === 'patient' ? 'doctor' : 'patient'),
      specialty: contact.specialty,
      lastMessage: '',
      lastMessageTime: '',
      unread: false,
    }));
    
    // Fetch the latest message for each contact
    for (const contact of contacts) {
      await enrichContactWithMessages(contact, user.id);
    }
    
    return contacts;
  }
  
  // Fetch profile data for the contact IDs we found
  const { data: profilesData, error: profilesError } = await supabase
    .from('profiles')
    .select('*')
    .in('id', contactIds);
  
  if (profilesError) throw profilesError;
  
  // Process the contacts data
  const contacts: ContactWithMessages[] = profilesData.map((profile: any) => ({
    id: profile.id,
    name: profile.full_name || 'Unknown',
    role: profile.role || (userRole === 'patient' ? 'doctor' : 'patient'),
    specialty: profile.specialty,
    lastMessage: '',
    lastMessageTime: '',
    unread: false,
  }));
  
  // Fetch the latest message for each contact
  for (const contact of contacts) {
    await enrichContactWithMessages(contact, user.id);
  }
  
  return contacts;
};

// Helper function to add messaging data to contacts
const enrichContactWithMessages = async (contact: ContactWithMessages, userId: string) => {
  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .or(`sender_id.eq.${contact.id},receiver_id.eq.${contact.id}`)
    .order('created_at', { ascending: false })
    .limit(1);
    
  if (messages && messages.length > 0) {
    const latestMessage = messages[0];
    contact.lastMessage = latestMessage.content;
    contact.lastMessageTime = new Date(latestMessage.created_at).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    contact.unread = latestMessage.read_at === null && latestMessage.sender_id === contact.id;
  }
};

// Get unread message count across all contacts
export const getUnreadMessageCount = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return 0;
  
  const { count, error } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('receiver_id', user.id)
    .is('read_at', null);
    
  if (error) {
    console.error("Error fetching unread message count:", error);
    return 0;
  }
  
  return count || 0;
};
