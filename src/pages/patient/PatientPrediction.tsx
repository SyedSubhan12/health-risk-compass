
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  PageContainer, 
  PageHeader, 
  PageSection 
} from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HealthCard } from "@/components/ui/health-card";
import { 
  Heart, 
  Droplet, 
  Activity, 
  Weight, 
  ArrowLeft 
} from "lucide-react";
import { 
  HealthInputFormFields, 
  defaultHealthInputs, 
  calculateHealthRisks 
} from "@/data/mockData";

export default function PatientPrediction() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<HealthInputFormFields>(defaultHealthInputs);
  const [page, setPage] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(calculateHealthRisks(defaultHealthInputs));
  
  const totalPages = 4;

  const updateFormData = (fieldName: keyof HealthInputFormFields, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const calculatedRisks = calculateHealthRisks(formData);
    setResults(calculatedRisks);
    setShowResults(true);
  };

  const resetForm = () => {
    setFormData(defaultHealthInputs);
    setShowResults(false);
    setPage(1);
  };

  // Format risk type for display
  const formatRiskType = (type: string) => {
    switch (type) {
      case "heartDisease":
        return "Heart Disease";
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  // Map risk types to icons
  const getRiskIcon = (type: string) => {
    switch (type) {
      case "diabetes":
        return <Droplet className="h-5 w-5" />;
      case "heartDisease":
        return <Heart className="h-5 w-5" />;
      case "hypertension":
        return <Activity className="h-5 w-5" />;
      case "obesity":
        return <Weight className="h-5 w-5" />;
      default:
        return <Activity className="h-5 w-5" />;
    }
  };

  // Calculate BMI for display
  const calculateBMI = () => {
    if (formData.height && formData.weight) {
      const heightInMeters = formData.height / 100;
      return (formData.weight / (heightInMeters * heightInMeters)).toFixed(1);
    }
    return "N/A";
  };

  return (
    <PageContainer>
      <PageHeader
        title="Health Risk Prediction"
        description="Enter your health information to generate a personalized risk assessment"
        actions={
          <Button variant="outline" onClick={() => navigate("/patient-dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        }
      />

      {!showResults ? (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Health Information Form</CardTitle>
            <CardDescription>
              Page {page} of {totalPages} - Please provide accurate information for the best results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form id="health-form" onSubmit={handleSubmit}>
              {page === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <div className="flex items-center space-x-2">
                        <Input 
                          id="age" 
                          type="number" 
                          min="18" 
                          max="100" 
                          value={formData.age} 
                          onChange={(e) => updateFormData("age", parseInt(e.target.value) || 0)}
                          required
                        />
                        <span className="text-sm text-muted-foreground w-12">years</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Gender</Label>
                      <RadioGroup 
                        defaultValue={formData.gender} 
                        value={formData.gender}
                        onValueChange={(value) => updateFormData("gender", value)}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="male" id="male" />
                          <Label htmlFor="male">Male</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="female" id="female" />
                          <Label htmlFor="female">Female</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="other" id="other" />
                          <Label htmlFor="other">Other</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="height">Height</Label>
                      <div className="flex items-center space-x-2">
                        <Input 
                          id="height" 
                          type="number" 
                          min="120" 
                          max="220" 
                          value={formData.height} 
                          onChange={(e) => updateFormData("height", parseInt(e.target.value) || 0)}
                          required
                        />
                        <span className="text-sm text-muted-foreground w-12">cm</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight</Label>
                      <div className="flex items-center space-x-2">
                        <Input 
                          id="weight" 
                          type="number" 
                          min="30" 
                          max="200" 
                          value={formData.weight} 
                          onChange={(e) => updateFormData("weight", parseInt(e.target.value) || 0)}
                          required
                        />
                        <span className="text-sm text-muted-foreground w-12">kg</span>
                      </div>
                    </div>
                  </div>
                  
                  {formData.height > 0 && formData.weight > 0 && (
                    <div className="p-3 bg-accent rounded-md mt-2">
                      <p className="text-sm">Your BMI: <span className="font-semibold">{calculateBMI()}</span></p>
                    </div>
                  )}
                </div>
              )}
              
              {page === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="systolicBP">Systolic Blood Pressure</Label>
                      <div className="flex items-center space-x-2">
                        <Input 
                          id="systolicBP" 
                          type="number" 
                          min="80" 
                          max="220" 
                          value={formData.systolicBP} 
                          onChange={(e) => updateFormData("systolicBP", parseInt(e.target.value) || 0)}
                          required
                        />
                        <span className="text-sm text-muted-foreground w-12">mmHg</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="diastolicBP">Diastolic Blood Pressure</Label>
                      <div className="flex items-center space-x-2">
                        <Input 
                          id="diastolicBP" 
                          type="number" 
                          min="40" 
                          max="130" 
                          value={formData.diastolicBP} 
                          onChange={(e) => updateFormData("diastolicBP", parseInt(e.target.value) || 0)}
                          required
                        />
                        <span className="text-sm text-muted-foreground w-12">mmHg</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="glucoseLevel">Fasting Glucose Level</Label>
                      <div className="flex items-center space-x-2">
                        <Input 
                          id="glucoseLevel" 
                          type="number" 
                          min="50" 
                          max="300" 
                          value={formData.glucoseLevel} 
                          onChange={(e) => updateFormData("glucoseLevel", parseInt(e.target.value) || 0)}
                          required
                        />
                        <span className="text-sm text-muted-foreground w-12">mg/dL</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cholesterolTotal">Total Cholesterol</Label>
                      <div className="flex items-center space-x-2">
                        <Input 
                          id="cholesterolTotal" 
                          type="number" 
                          min="100" 
                          max="400" 
                          value={formData.cholesterolTotal} 
                          onChange={(e) => updateFormData("cholesterolTotal", parseInt(e.target.value) || 0)}
                          required
                        />
                        <span className="text-sm text-muted-foreground w-12">mg/dL</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hdlCholesterol">HDL Cholesterol</Label>
                      <div className="flex items-center space-x-2">
                        <Input 
                          id="hdlCholesterol" 
                          type="number" 
                          min="20" 
                          max="100" 
                          value={formData.hdlCholesterol} 
                          onChange={(e) => updateFormData("hdlCholesterol", parseInt(e.target.value) || 0)}
                          required
                        />
                        <span className="text-sm text-muted-foreground w-12">mg/dL</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="ldlCholesterol">LDL Cholesterol</Label>
                      <div className="flex items-center space-x-2">
                        <Input 
                          id="ldlCholesterol" 
                          type="number" 
                          min="40" 
                          max="250" 
                          value={formData.ldlCholesterol} 
                          onChange={(e) => updateFormData("ldlCholesterol", parseInt(e.target.value) || 0)}
                          required
                        />
                        <span className="text-sm text-muted-foreground w-12">mg/dL</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {page === 3 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Smoking Status</Label>
                    <Select 
                      value={formData.smokingStatus} 
                      onValueChange={(value) => updateFormData("smokingStatus", value as "never" | "former" | "current")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select smoking status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="never">Never Smoked</SelectItem>
                        <SelectItem value="former">Former Smoker</SelectItem>
                        <SelectItem value="current">Current Smoker</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Alcohol Consumption</Label>
                    <Select 
                      value={formData.alcoholConsumption} 
                      onValueChange={(value) => updateFormData("alcoholConsumption", value as "none" | "moderate" | "heavy")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select alcohol consumption" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="moderate">Moderate (1-2 drinks/day)</SelectItem>
                        <SelectItem value="heavy">Heavy (3+ drinks/day)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Physical Activity Level</Label>
                    <Select 
                      value={formData.physicalActivity} 
                      onValueChange={(value) => updateFormData("physicalActivity", value as "inactive" | "moderate" | "active")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select physical activity level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inactive">Inactive (Less than 30 min/week)</SelectItem>
                        <SelectItem value="moderate">Moderate (30-150 min/week)</SelectItem>
                        <SelectItem value="active">Active (150+ min/week)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              
              {page === 4 && (
                <div className="space-y-4">
                  <div className="space-y-4 border rounded-md p-4">
                    <Label className="font-medium">Family Medical History</Label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="familyHistoryDiabetes" 
                          checked={formData.familyHistoryDiabetes} 
                          onCheckedChange={(checked) => updateFormData("familyHistoryDiabetes", !!checked)}
                        />
                        <Label htmlFor="familyHistoryDiabetes" className="font-normal">Family history of diabetes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="familyHistoryHeartDisease" 
                          checked={formData.familyHistoryHeartDisease} 
                          onCheckedChange={(checked) => updateFormData("familyHistoryHeartDisease", !!checked)}
                        />
                        <Label htmlFor="familyHistoryHeartDisease" className="font-normal">Family history of heart disease</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="familyHistoryHypertension" 
                          checked={formData.familyHistoryHypertension} 
                          onCheckedChange={(checked) => updateFormData("familyHistoryHypertension", !!checked)}
                        />
                        <Label htmlFor="familyHistoryHypertension" className="font-normal">Family history of hypertension</Label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 border rounded-md p-4">
                    <Label className="font-medium">Current Medications</Label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="medicationHypertension" 
                          checked={formData.medicationHypertension} 
                          onCheckedChange={(checked) => updateFormData("medicationHypertension", !!checked)}
                        />
                        <Label htmlFor="medicationHypertension" className="font-normal">Taking medication for hypertension</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="medicationCholesterol" 
                          checked={formData.medicationCholesterol} 
                          onCheckedChange={(checked) => updateFormData("medicationCholesterol", !!checked)}
                        />
                        <Label htmlFor="medicationCholesterol" className="font-normal">Taking medication for cholesterol</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="medicationDiabetes" 
                          checked={formData.medicationDiabetes} 
                          onCheckedChange={(checked) => updateFormData("medicationDiabetes", !!checked)}
                        />
                        <Label htmlFor="medicationDiabetes" className="font-normal">Taking medication for diabetes</Label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <div className="flex space-x-2">
              {page === totalPages ? (
                <Button type="submit" form="health-form">
                  Generate Prediction
                </Button>
              ) : (
                <Button onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}>
                  Next
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      ) : (
        <div className="space-y-6">
          <PageSection
            title="Your Health Risk Prediction"
            description="Based on the information you provided, here are your risk assessments"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {results.map((risk) => (
                <HealthCard
                  key={risk.id}
                  title={formatRiskType(risk.type)}
                  value={risk.score}
                  maxValue={risk.maxScore}
                  riskLevel={risk.level}
                  icon={getRiskIcon(risk.type)}
                  recommendation={risk.recommendation}
                />
              ))}
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => navigate("/patient-dashboard")}>
                Return to Dashboard
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Start New Prediction
              </Button>
            </div>
          </PageSection>
        </div>
      )}
    </PageContainer>
  );
}
