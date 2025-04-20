
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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
  
  let query;
  
  if (userRole === 'patient') {
    // Patients see doctors
    query = supabase
      .from('profiles')
      .select('*')
      .eq('role', 'doctor');
  } else {
    // Doctors see patients they have relationships with
    query = supabase
      .from('doctor_patient_relationships')
      .select('profiles!doctor_patient_relationships_patient_id_fkey(*)')
      .eq('doctor_id', user.id);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  
  // Process the contacts data
  let contacts: ContactWithMessages[] = [];
  
  if (userRole === 'patient') {
    contacts = data.map((doctor: any) => ({
      id: doctor.id,
      name: doctor.full_name || 'Unknown',
      role: 'doctor',
      specialty: doctor.specialty,
      lastMessage: '',
      lastMessageTime: '',
      unread: false,
    }));
  } else {
    contacts = data.map((relationship: any) => {
      const patient = relationship.profiles;
      return {
        id: patient.id,
        name: patient.full_name || 'Unknown',
        role: 'patient',
        lastMessage: '',
        lastMessageTime: '',
        unread: false,
      };
    });
  }
  
  // Fetch the latest message for each contact
  for (const contact of contacts) {
    const { data: messages } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
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
  }
  
  return contacts;
};
