
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, MessageCircle, Send } from "lucide-react";

interface MessageContact {
  id: string;
  name: string;
  role: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unread?: boolean;
  isActive?: boolean;
}

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isMe: boolean;
}

interface MessageCenterProps {
  contacts: MessageContact[];
  messages: Message[];
  activeContactId?: string;
  onSelectContact: (contactId: string) => void;
  onSendMessage: (text: string) => void;
}

export function MessageCenter({
  contacts,
  messages,
  activeContactId,
  onSelectContact,
  onSendMessage,
}: MessageCenterProps) {
  const [messageText, setMessageText] = React.useState("");

  const handleSendMessage = () => {
    if (messageText.trim()) {
      onSendMessage(messageText);
      setMessageText("");
    }
  };

  const activeContact = contacts.find(contact => contact.id === activeContactId);

  return (
    <div className="flex flex-col md:flex-row h-[600px] gap-4">
      <Card className="md:w-1/3 h-full flex flex-col">
        <CardHeader>
          <CardTitle className="text-lg">Conversations</CardTitle>
        </CardHeader>
        <CardContent className="p-2 flex-1 overflow-y-auto">
          {contacts.length > 0 ? (
            <div className="space-y-1">
              {contacts.map((contact) => (
                <Button
                  key={contact.id}
                  variant={contact.id === activeContactId ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => onSelectContact(contact.id)}
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
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center mr-2">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-base">{activeContact.name}</CardTitle>
                  <p className="text-xs text-muted-foreground">{activeContact.role}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 flex flex-col">
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length > 0 ? (
                  messages.map((message) => (
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
                  ))
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
                  <Button type="submit" size="icon">
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
