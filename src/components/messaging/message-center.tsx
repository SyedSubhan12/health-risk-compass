
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, MessageCircle, Send } from "lucide-react";
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
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeContact = contacts.find(contact => contact.id === activeContactId);

  useEffect(() => {
    if (user) {
      loadContacts();
    }
  }, [user]);

  useEffect(() => {
    if (activeContactId) {
      loadMessages(activeContactId);
      
      // Mark messages as read when viewing conversation
      markMessagesAsRead(activeContactId).catch(error => {
        console.error("Error marking messages as read:", error);
      });
      
      // Set up real-time listener for new messages
      const channel = supabase
        .channel('messages-channel')
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `sender_id=eq.${activeContactId},receiver_id=eq.${user?.id}`
        }, payload => {
          const newMessage = payload.new;
          
          // Add the new message to the state
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
          
          // Mark message as read since we're currently viewing this conversation
          markMessagesAsRead(activeContactId);
        })
        .subscribe();
      
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [activeContactId, user]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadContacts = async () => {
    try {
      setLoading(true);
      const contactsData = await fetchContacts(user?.role || 'patient');
      setContacts(contactsData);
      
      // Select first contact if none is selected
      if (contactsData.length > 0 && !activeContactId) {
        setActiveContactId(contactsData[0].id);
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
      const messagesData = await fetchMessages(contactId);
      setMessages(messagesData);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load messages"
      });
      console.error("Error loading messages:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !activeContactId) return;
    
    try {
      // Add optimistic message
      const optimisticMessage: Message = {
        id: `temp-${Date.now()}`,
        senderId: user?.id || '',
        text: messageText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: true
      };
      
      setMessages(prev => [...prev, optimisticMessage]);
      setMessageText("");
      
      // Send to server
      await sendMessage(activeContactId, messageText);
      
      // Update the contact's last message in the list
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
  };

  const handleAppointmentSuccess = () => {
    setShowScheduleDialog(false);
    toast({
      title: "Appointment Scheduled",
      description: `Your appointment with Dr. ${activeContact?.name} has been scheduled.`
    });
  };

  return (
    <div className="flex flex-col md:flex-row h-[600px] gap-4">
      <Card className="md:w-1/3 h-full flex flex-col">
        <CardHeader>
          <CardTitle className="text-lg">Conversations</CardTitle>
        </CardHeader>
        <CardContent className="p-2 flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center p-4">
              <span>Loading contacts...</span>
            </div>
          ) : contacts.length > 0 ? (
            <div className="space-y-1">
              {contacts.map((contact) => (
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
                      {contact.lastMessage && (
                        <p className="text-xs text-muted-foreground truncate">{contact.lastMessage}</p>
                      )}
                    </div>
                    {contact.unread && (
                      <div className="w-2 h-2 bg-primary rounded-full ml-2"></div>
                    )}
                  </div>
                </Button>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-4">
              <MessageCircle className="h-8 w-8 text-muted-foreground mb-2" />
              <h3 className="font-medium">No conversations yet</h3>
              <p className="text-sm text-muted-foreground">You'll see your conversations here</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="md:w-2/3 h-full flex flex-col">
        {activeContact ? (
          <>
            <CardHeader className="pb-2 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center mr-2">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{activeContact.name}</CardTitle>
                    <p className="text-xs text-muted-foreground">{activeContact.role === 'doctor' ? `${activeContact.specialty || 'Doctor'}` : 'Patient'}</p>
                  </div>
                </div>
                
                {user?.role === 'patient' && activeContact.role === 'doctor' && (
                  <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">Schedule Appointment</Button>
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
                {messages.length > 0 ? (
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
                    <h3 className="font-medium">No messages yet</h3>
                    <p className="text-sm text-muted-foreground">Start the conversation</p>
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
