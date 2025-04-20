
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, MessageCircle } from "lucide-react";

interface DoctorCardProps {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  rating: number;
  availability: string;
  onSelect?: () => void;
}

export function DoctorCard({
  id,
  name,
  specialty,
  bio,
  rating,
  availability,
  onSelect,
}: DoctorCardProps) {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center overflow-hidden">
            <User className="h-6 w-6 text-accent-foreground" />
          </div>
          <div>
            <CardTitle className="text-lg">{name}</CardTitle>
            <p className="text-sm text-muted-foreground">{specialty}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 flex-1 flex flex-col">
        <div className="space-y-2 flex-1">
          <p className="text-sm">{bio}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-sm text-yellow-500 mr-1">★</span>
              <span className="text-sm font-medium">{rating}</span>
            </div>
            <p className="text-sm text-muted-foreground">{availability}</p>
          </div>
        </div>
        <div className="flex flex-col space-y-2 mt-auto">
          <Button onClick={onSelect} className="w-full">
            Select as Doctor
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link to="#">
              <MessageCircle className="mr-2 h-4 w-4" />
              Contact
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
