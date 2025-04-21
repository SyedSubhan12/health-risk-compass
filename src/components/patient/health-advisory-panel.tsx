
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { HealthCard } from "@/components/ui/health-card";
import { Calendar, Salad, Dumbbell, Stethoscope, Bell, Heart } from "lucide-react";
import { toast } from "sonner";

interface HealthAdvisoryPanelProps {
  prediction?: {
    prediction: number;
    confidence: number;
    modelName: string;
    modelId: string;
  };
  condition: "diabetes" | "heartattack" | "stroke";
}

export function HealthAdvisoryPanel({ prediction, condition }: HealthAdvisoryPanelProps) {
  // If we don't have a prediction yet, don't render anything substantive
  if (!prediction) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Health Advisory</CardTitle>
          <CardDescription>
            Complete a health risk assessment to receive personalized recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTitle>No data available</AlertTitle>
            <AlertDescription>
              Please complete a prediction analysis to receive personalized health recommendations.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Determine risk level based on prediction value
  const getRiskLevel = (value: number) => {
    if (value < 40) return "low";
    if (value < 70) return "moderate";
    return "high";
  };
  
  const riskLevel = getRiskLevel(prediction.prediction);

  // Content based on condition and risk level
  const getRecommendations = () => {
    switch (condition) {
      case "diabetes":
        return {
          lifestyle: [
            "Reduce sugar and refined carbohydrate intake",
            "Include more fiber-rich foods in your diet",
            "Stay hydrated with water instead of sugary drinks",
            "Aim for 30 minutes of moderate exercise 5 days a week",
            riskLevel === "high" ? "Consider working with a dietitian to create a meal plan" : null,
          ].filter(Boolean),
          tests: [
            "HbA1c test (every 3-6 months)",
            "Annual comprehensive eye exam",
            "Regular blood pressure checks",
            riskLevel === "high" ? "Kidney function tests every 6 months" : "Annual kidney function test",
          ],
          specialists: [
            "Endocrinologist",
            riskLevel === "high" ? "Nephrologist (for kidney health)" : null,
            riskLevel === "high" ? "Ophthalmologist (for eye health)" : null,
          ].filter(Boolean),
          visitFrequency: riskLevel === "high" ? "3 months" : "6 months",
          followUp: new Date(Date.now() + (riskLevel === "high" ? 90 : 180) * 24 * 60 * 60 * 1000).toLocaleDateString(),
        };
      case "heartattack":
        return {
          lifestyle: [
            "Adopt a heart-healthy diet low in saturated fats",
            "Limit sodium intake to less than 2,300mg daily",
            "Aim for 150 minutes of cardiovascular exercise weekly",
            "Practice stress reduction techniques daily",
            riskLevel === "high" ? "Consider a medically supervised exercise program" : null,
          ].filter(Boolean),
          tests: [
            "Lipid profile (every 6 months)",
            "Blood pressure monitoring (weekly)",
            "Annual stress test",
            riskLevel === "high" ? "Echocardiogram every 6 months" : "Annual echocardiogram",
          ],
          specialists: [
            "Cardiologist",
            riskLevel === "high" ? "Cardiac rehabilitation specialist" : null,
          ].filter(Boolean),
          visitFrequency: riskLevel === "high" ? "3 months" : "6 months",
          followUp: new Date(Date.now() + (riskLevel === "high" ? 90 : 180) * 24 * 60 * 60 * 1000).toLocaleDateString(),
        };
      case "stroke":
        return {
          lifestyle: [
            "Follow a Mediterranean or DASH diet pattern",
            "Limit alcohol consumption",
            "Quit smoking (if applicable)",
            "Aim for 30 minutes of daily physical activity",
            riskLevel === "high" ? "Consider balance and coordination exercises" : null,
          ].filter(Boolean),
          tests: [
            "Regular blood pressure monitoring",
            "Carotid artery screening",
            "Cholesterol check every 6 months",
            riskLevel === "high" ? "MRI or CT scan annually" : null,
          ].filter(Boolean),
          specialists: [
            "Neurologist",
            riskLevel === "high" ? "Vascular surgeon (for consultation)" : null,
            riskLevel === "high" ? "Physical therapist (preventative therapy)" : null,
          ].filter(Boolean),
          visitFrequency: riskLevel === "high" ? "3 months" : "6 months",
          followUp: new Date(Date.now() + (riskLevel === "high" ? 90 : 180) * 24 * 60 * 60 * 1000).toLocaleDateString(),
        };
      default:
        return {
          lifestyle: [
            "Maintain a balanced diet rich in fruits and vegetables",
            "Stay physically active with 150 minutes of exercise weekly",
            "Ensure 7-8 hours of quality sleep nightly",
            "Practice stress management techniques",
          ],
          tests: [
            "Annual physical exam",
            "Regular blood pressure checks",
            "Annual blood work",
          ],
          specialists: ["Primary care physician"],
          visitFrequency: "12 months",
          followUp: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        };
    }
  };

  const recommendations = getRecommendations();

  const scheduleReminder = (type: string) => {
    toast.success(`Reminder scheduled for ${type}`, {
      description: `You'll receive notifications about your ${type.toLowerCase()} schedule`,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          Personalized Health Advisory
        </CardTitle>
        <CardDescription>
          Based on your {condition} risk assessment ({riskLevel} risk)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <HealthCard
            title="Risk Level"
            value={prediction.prediction}
            maxValue={100}
            riskLevel={riskLevel}
            icon={<Heart className="h-5 w-5" />}
            recommendation={`Your risk level requires a follow-up in ${recommendations.visitFrequency}`}
          />
        </div>

        <Separator className="my-4" />

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Salad className="h-5 w-5 text-green-500" />
            <h3 className="text-lg font-medium">Recommended Lifestyle Changes</h3>
          </div>
          <ul className="ml-8 list-disc space-y-1">
            {recommendations.lifestyle.map((item, index) => (
              <li key={index} className="text-sm">{item}</li>
            ))}
          </ul>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2"
            onClick={() => scheduleReminder("Lifestyle Changes")}
          >
            <Bell className="mr-2 h-4 w-4" />
            Set Reminders
          </Button>
        </div>

        <Separator className="my-4" />

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-medium">Follow-Up Medical Tests</h3>
          </div>
          <ul className="ml-8 list-disc space-y-1">
            {recommendations.tests.map((test, index) => (
              <li key={index} className="text-sm">{test}</li>
            ))}
          </ul>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2"
            onClick={() => scheduleReminder("Medical Tests")}
          >
            <Bell className="mr-2 h-4 w-4" />
            Schedule Tests
          </Button>
        </div>

        <Separator className="my-4" />

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Doctor Visit Reminders</h3>
          </div>
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Recommended specialists:</h4>
                <ul className="ml-5 list-disc space-y-1 mt-2">
                  {recommendations.specialists.map((specialist, index) => (
                    <li key={index} className="text-sm">{specialist}</li>
                  ))}
                </ul>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Next follow-up:</div>
                <div className="flex items-center mt-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span className="font-medium">{recommendations.followUp}</span>
                </div>
              </div>
            </div>
          </div>
          <Button 
            variant="default" 
            size="sm" 
            className="mt-2"
            onClick={() => scheduleReminder("Doctor Visits")}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Appointment
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
        <Button 
          variant="outline" 
          className="w-full sm:w-auto"
          onClick={() => {
            toast.success("Health plan saved", {
              description: "Your personalized health plan has been saved to your profile"
            });
          }}
        >
          Save Health Plan
        </Button>
        <Button 
          className="w-full sm:w-auto"
          onClick={() => {
            toast.success("All reminders activated", {
              description: "You'll receive notifications for all recommended actions"
            });
          }}
        >
          Set All Reminders
        </Button>
      </CardFooter>
    </Card>
  );
}
