import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, MessageCircle, Send, CalendarIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchContacts,
  fetchMessages,
  sendMessage,
  markMessagesAsRead,
  ContactWithMessages
} from "@/services/messagingService";
import { toast } from "@/hooks/use-toast";
import { AppointmentForm } from "@/components/appointments/AppointmentForm";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { 
  getDoctorPatientConnections, 
  getPatientDoctorConnections 
} from "@/services/appointmentService";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isMe: boolean;
}

export function MessageCenter() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<ContactWithMessages[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeContactId, setActiveContactId] = useState<string | undefined>();
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeContact = contacts.find(contact => contact.id === activeContactId);
  
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (user) {
      loadContacts();
    }
  }, [user]);

  useEffect(() => {
    if (activeContactId) {
      loadMessages(activeContactId);
      
      markMessagesAsRead(activeContactId).catch(error => {
        console.error("Error marking messages as read:", error);
      });
      
      const channel = supabase
        .channel('messages-channel')
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `sender_id=eq.${activeContactId},receiver_id=eq.${user?.id}`
        }, payload => {
          const newMessage = payload.new;
          
          const formattedMessage = {
            id: newMessage.id,
            senderId: newMessage.sender_id,
            text: newMessage.content,
            timestamp: new Date(newMessage.created_at).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            }),
            isMe: false
          };
          
          setMessages(prev => [...prev, formattedMessage]);
          
          markMessagesAsRead(activeContactId);
          
          setContacts(prev => 
            prev.map(contact => 
              contact.id === activeContactId 
                ? { 
                    ...contact, 
                    lastMessage: newMessage.content,
                    lastMessageTime: new Date(newMessage.created_at).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    }),
                    unread: false
                  }
                : contact
            )
          );
        })
        .subscribe();
      
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [activeContactId, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadContacts = async () => {
    try {
      setLoading(true);
      
      let connectionsData: any[] = [];
      
      if (user?.role === 'patient') {
        connectionsData = await getPatientDoctorConnections(user.id);
      } else if (user?.role === 'doctor') {
        connectionsData = await getDoctorPatientConnections(user.id);
      }
      
      if (connectionsData.length > 0) {
        const formattedContacts: ContactWithMessages[] = connectionsData.map((connection) => ({
          id: connection.id,
          name: connection.name,
          role: user?.role === 'patient' ? 'doctor' : 'patient',
          specialty: connection.specialty,
          lastMessage: '',
          lastMessageTime: '',
          unread: false
        }));
        
        for (const contact of formattedContacts) {
          try {
            const messagesData = await fetchMessages(contact.id);
            if (messagesData.length > 0) {
              const latestMessage = messagesData[messagesData.length - 1];
              contact.lastMessage = latestMessage.text;
              contact.lastMessageTime = latestMessage.timestamp;
              contact.unread = !latestMessage.isMe && latestMessage.senderId === contact.id;
            }
          } catch (error) {
            console.error(`Error loading messages for contact ${contact.id}:`, error);
          }
        }
        
        setContacts(formattedContacts);
      } else {
        const contactsList = await fetchContacts(user?.role || 'patient');
        setContacts(contactsList);
      }
      
      if (contacts.length > 0 && !activeContactId) {
        setActiveContactId(contacts[0].id);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load contacts"
      });
      console.error("Error loading contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (contactId: string) => {
    try {
      setLoadingMessages(true);
      const messagesData = await fetchMessages(contactId);
      setMessages(messagesData);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load messages"
      });
      console.error("Error loading messages:", error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !activeContactId) return;
    
    try {
      const optimisticMessage: Message = {
        id: `temp-${Date.now()}`,
        senderId: user?.id || '',
        text: messageText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: true
      };
      
      setMessages(prev => [...prev, optimisticMessage]);
      setMessageText("");
      
      await sendMessage(activeContactId, messageText);
      
      setContacts(prev => 
        prev.map(contact => 
          contact.id === activeContactId 
            ? { 
                ...contact, 
                lastMessage: messageText,
                lastMessageTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }
            : contact
        )
      );
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message"
      });
      console.error("Error sending message:", error);
    }
  };

  const handleSelectContact = (contactId: string) => {
    setActiveContactId(contactId);
    
    setContacts(prev => 
      prev.map(contact => 
        contact.id === contactId && contact.unread
          ? { ...contact, unread: false }
          : contact
      )
    );
  };

  const handleAppointmentSuccess = () => {
    setShowScheduleDialog(false);
    toast({
      title: "Appointment Scheduled",
      description: `Your appointment with Dr. ${activeContact?.name} has been scheduled.`
    });
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className="flex flex-col md:flex-row h-[600px] gap-4">
      <Card className={`${activeContactId && isMobile ? 'hidden' : 'flex'} md:flex md:w-1/3 h-full flex-col`}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Conversations</CardTitle>
            <Badge variant="secondary">{contacts.filter(c => c.unread).length}</Badge>
          </div>
          <div className="relative">
            <Input 
              placeholder="Search contacts" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
        </CardHeader>
        <CardContent className="p-2 flex-1 overflow-y-auto">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-4 p-3 rounded-md">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-full max-w-[150px]" />
                    <Skeleton className="h-3 w-full max-w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredContacts.length > 0 ? (
            <div className="space-y-1">
              {filteredContacts.map((contact) => (
                <Button
                  key={contact.id}
                  variant={contact.id === activeContactId ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => handleSelectContact(contact.id)}
                >
                  <div className="flex items-center w-full">
                    <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center mr-2">
                      <User className="h-4 w-4" />
                    </div>
                    <div className="flex-1 overflow-hidden text-left">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm truncate">{contact.name}</p>
                        {contact.lastMessageTime && (
                          <span className="text-xs text-muted-foreground">{contact.lastMessageTime}</span>
                        )}
                      </div>
                      <div className="flex items-center">
                        {contact.lastMessage ? (
                          <p className="text-xs text-muted-foreground truncate flex-1">{contact.lastMessage}</p>
                        ) : (
                          <p className="text-xs text-muted-foreground italic">No messages yet</p>
                        )}
                        {contact.unread && (
                          <div className="w-2 h-2 bg-primary rounded-full ml-2 flex-shrink-0"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-4">
              <MessageCircle className="h-8 w-8 text-muted-foreground mb-2" />
              <h3 className="font-medium">No conversations found</h3>
              <p className="text-sm text-muted-foreground">
                {searchTerm ? "Try a different search term" : "Connect with healthcare providers"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className={`${!activeContactId && isMobile ? 'hidden' : 'flex'} md:flex md:w-2/3 h-full flex-col`}>
        {activeContact ? (
          <>
            <CardHeader className="pb-2 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {isMobile && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mr-2"
                      onClick={() => setActiveContactId(undefined)}
                    >
                      <span className="sr-only">Back</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                        <path d="m15 18-6-6 6-6" />
                      </svg>
                    </Button>
                  )}
                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center mr-2">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{activeContact.name}</CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {activeContact.role === 'doctor' 
                        ? `${activeContact.specialty || 'Doctor'}` 
                        : 'Patient'}
                    </p>
                  </div>
                </div>
                
                {user?.role === 'patient' && activeContact.role === 'doctor' && (
                  <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        Schedule Appointment
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <AppointmentForm 
                        doctorId={activeContact.id} 
                        doctorName={activeContact.name}
                        onSuccess={handleAppointmentSuccess}
                        onCancel={() => setShowScheduleDialog(false)}
                      />
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 flex flex-col">
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {loadingMessages ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
                        <Skeleton className={`h-16 w-2/3 rounded-lg ${i % 2 === 0 ? "ml-auto" : "mr-auto"}`} />
                      </div>
                    ))}
                  </div>
                ) : messages.length > 0 ? (
                  <>
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isMe ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.isMe
                              ? "bg-primary text-primary-foreground"
                              : "bg-accent"
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <p className="text-xs opacity-70 text-right mt-1">
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <MessageCircle className="h-8 w-8 text-muted-foreground mb-2" />
                    <h3 className="font-medium">Start a conversation</h3>
                    <p className="text-sm text-muted-foreground">Send a message to {activeContact.name}</p>
                  </div>
                )}
              </div>
              <div className="p-3 border-t">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex space-x-2"
                >
                  <Input
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" disabled={!messageText.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </CardContent>
          </>
        ) : (
          <CardContent className="h-full flex flex-col items-center justify-center text-center p-6">
            <MessageCircle className="h-12 w-12 text-muted-foreground mb-3" />
            <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
            <p className="text-muted-foreground">
              Choose a contact from the list to start messaging
            </p>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
