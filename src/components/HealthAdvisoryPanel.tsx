
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, User, Info, CheckCircle, BellRing } from "lucide-react";

export interface AdvisoryItem {
  title: string;
  items: string[];
  icon?: React.ReactNode;
}

const sectionStyle = "mb-6 p-4 rounded-lg bg-white shadow-md/5 border border-health-primary/10";

const mockData = {
  lifestyle: [
    "Adopt a Mediterranean diet rich in vegetables, healthy fats, and whole grains.",
    "Aim for 30 minutes of moderate exercise 5x/week (e.g., brisk walking, swimming).",
    "Limit daily screen time and schedule regular breaks for light stretching.",
    "Establish a consistent sleep schedule (7-8 hours/night).",
    "Practice mindfulness (e.g., meditation, deep breathing) daily."
  ],
  tests: [
    "Blood Pressure Check — within next 15 days",
    "HbA1c Test (Diabetes Screening) — within next 1 month",
    "Lipid Panel — within next 1 month",
    "Annual Physical Exam — schedule this quarter"
  ],
  doctorVisits: [
    "Cardiologist — for routine heart health review due to increased risk score.",
    "Nutritionist — to help tailor your diet for optimal wellness.",
    "General Practitioner — for preventive health check and results review."
  ],
  notifications: [
    "⏰ Daily 8am: Morning activity reminder and motivational tip.",
    "📅 Weekly: Check-in for new habits and submitted health logs.",
    "📲 Secure notifications for upcoming appointments and test reminders."
  ]
};

export function HealthAdvisoryPanel() {
  return (
    <div className="my-8 max-w-2xl mx-auto">
      <Card className="bg-white/95 shadow-xl border-health-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl text-health-primary flex items-center gap-2">
            <Info className="w-6 h-6" /> Personalized Health Advisory Panel
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            Actionable recommendations based on your latest assessment and health profile.
          </p>
        </CardHeader>
        <CardContent>
          <section className={sectionStyle}>
            <h3 className="font-semibold text-lg mb-2 flex items-center text-health-secondary gap-2">
              <CheckCircle className="w-5 h-5 mr-1" /> Recommended Lifestyle Changes
            </h3>
            <ul className="list-disc pl-6 space-y-1">
              {mockData.lifestyle.map((tip) => (
                <li key={tip}><span className="text-health-dark">{tip}</span></li>
              ))}
            </ul>
          </section>

          <section className={sectionStyle}>
            <h3 className="font-semibold text-lg mb-2 flex items-center text-health-secondary gap-2">
              <Calendar className="w-5 h-5 mr-1" /> Follow-Up Medical Tests
            </h3>
            <ul className="list-disc pl-6 space-y-1">
              {mockData.tests.map((test) => (
                <li key={test}><span className="text-health-dark">{test}</span></li>
              ))}
            </ul>
          </section>

          <section className={sectionStyle}>
            <h3 className="font-semibold text-lg mb-2 flex items-center text-health-secondary gap-2">
              <User className="w-5 h-5 mr-1" /> Doctor Visit Reminders
            </h3>
            <ul className="list-disc pl-6 space-y-1">
              {mockData.doctorVisits.map((visit) => (
                <li key={visit}><span className="text-health-dark">{visit}</span></li>
              ))}
            </ul>
          </section>

          <section className={sectionStyle}>
            <h3 className="font-semibold text-lg mb-2 flex items-center text-health-secondary gap-2">
              <BellRing className="w-5 h-5 mr-1" /> Upcoming Notifications
            </h3>
            <ul className="list-disc pl-6 space-y-1">
              {mockData.notifications.map((note) => (
                <li key={note}><span className="text-health-dark">{note}</span></li>
              ))}
            </ul>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}

export default HealthAdvisoryPanel;
