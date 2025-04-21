
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { AVAILABLE_MODELS, MLModel, makePrediction, ModelPrediction } from "@/services/modelService";
import { ArrowLeft, BrainCircuit, BarChart4, LineChart, Layers } from "lucide-react";
import { 
  ChartContainer, 
  ChartLegend, 
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface InputField {
  name: string;
  label: string;
  type: "number" | "slider" | "select";
  min?: number;
  max?: number;
  options?: string[];
  defaultValue: number | string;
}

// Sample input fields definition - this would typically come from model metadata
const SAMPLE_INPUT_FIELDS: InputField[] = [
  {
    name: "age",
    label: "Age",
    type: "number",
    min: 18,
    max: 100,
    defaultValue: 35
  },
  {
    name: "systolicBP",
    label: "Systolic Blood Pressure",
    type: "number",
    min: 80,
    max: 220,
    defaultValue: 120
  },
  {
    name: "diastolicBP",
    label: "Diastolic Blood Pressure",
    type: "number",
    min: 40,
    max: 130,
    defaultValue: 80
  },
  {
    name: "glucoseLevel",
    label: "Glucose Level",
    type: "number",
    min: 50,
    max: 300,
    defaultValue: 100
  },
  {
    name: "smokingIntensity",
    label: "Smoking Intensity",
    type: "slider",
    min: 0,
    max: 10,
    defaultValue: 0
  },
  {
    name: "physicalActivity",
    label: "Physical Activity",
    type: "select",
    options: ["Low", "Moderate", "High"],
    defaultValue: "Moderate"
  }
];

const ModelPrediction: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedModelId, setSelectedModelId] = useState<string>(AVAILABLE_MODELS[0].id);
  const [inputValues, setInputValues] = useState<Record<string, any>>(() => {
    // Initialize with default values from SAMPLE_INPUT_FIELDS
    return SAMPLE_INPUT_FIELDS.reduce((acc, field) => {
      acc[field.name] = field.defaultValue;
      return acc;
    }, {} as Record<string, any>);
  });
  const [predictionResult, setPredictionResult] = useState<ModelPrediction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [visualizationType, setVisualizationType] = useState<"bar" | "radar">("bar");

  // Get the selected model
  const selectedModel = AVAILABLE_MODELS.find(model => model.id === selectedModelId) || AVAILABLE_MODELS[0];

  // Handle input change
  const handleInputChange = (name: string, value: any) => {
    setInputValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission for prediction
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await makePrediction(selectedModelId, inputValues);
      setPredictionResult(result);
      toast.success("Prediction completed successfully!");
    } catch (error) {
      console.error("Prediction error:", error);
      toast.error("Failed to make prediction. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Transform prediction data for charts
  const getChartData = () => {
    if (!predictionResult) return [];

    // For bar chart - single value
    if (visualizationType === "bar") {
      return [
        {
          name: "Prediction",
          value: predictionResult.prediction,
          color: "#4f46e5" // Indigo color
        },
        {
          name: "Confidence",
          value: predictionResult.confidence,
          color: "#06b6d4" // Cyan color
        }
      ];
    }

    // For radar chart - multiple factors from input data
    return Object.entries(predictionResult.inputData).map(([key, value]) => {
      // Normalize values for radar chart
      const normalizedValue = 
        typeof value === 'number' 
          ? value 
          : typeof value === 'string' && !isNaN(Number(value))
            ? Number(value)
            : 50; // Default for non-numeric values
      
      return {
        subject: key.charAt(0).toUpperCase() + key.slice(1),
        value: normalizedValue,
        fullMark: 100
      };
    });
  };

  return (
    <PageContainer>
      <PageHeader
        title="ML Model Prediction"
        description="Generate predictions using trained machine learning models"
        actions={
          <Button variant="outline" onClick={() => navigate("/patient-dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Model Selection and Input */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BrainCircuit className="mr-2 h-5 w-5" /> Select Model
              </CardTitle>
              <CardDescription>
                Choose a machine learning model to generate predictions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {AVAILABLE_MODELS.map((model) => (
                  <div
                    key={model.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      selectedModelId === model.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedModelId(model.id)}
                  >
                    <h3 className="font-medium mb-1">{model.name}</h3>
                    <p className="text-xs text-muted-foreground">{model.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Input Parameters</CardTitle>
                <CardDescription>
                  Adjust the parameters for the {selectedModel.name} model
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {SAMPLE_INPUT_FIELDS.map((field) => (
                    <div key={field.name} className="space-y-2">
                      <Label htmlFor={field.name}>{field.label}</Label>
                      
                      {field.type === "number" && (
                        <div className="flex items-center space-x-2">
                          <Input
                            id={field.name}
                            type="number"
                            min={field.min}
                            max={field.max}
                            value={inputValues[field.name]}
                            onChange={(e) => handleInputChange(field.name, parseFloat(e.target.value))}
                            className="flex-1"
                          />
                          {field.min !== undefined && field.max !== undefined && (
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              ({field.min}-{field.max})
                            </span>
                          )}
                        </div>
                      )}
                      
                      {field.type === "slider" && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{field.min}</span>
                            <span>{field.max}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Slider
                              id={field.name}
                              min={field.min}
                              max={field.max}
                              step={1}
                              value={[inputValues[field.name]]}
                              onValueChange={(values) => handleInputChange(field.name, values[0])}
                            />
                            <span className="w-12 text-center">{inputValues[field.name]}</span>
                          </div>
                        </div>
                      )}
                      
                      {field.type === "select" && field.options && (
                        <Select 
                          value={inputValues[field.name]} 
                          onValueChange={(value) => handleInputChange(field.name, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={`Select ${field.label}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Processing..." : "Generate Prediction"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>

        {/* Right Column - Prediction Results */}
        <div className="col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Layers className="mr-2 h-5 w-5" /> Prediction Results
              </CardTitle>
              <CardDescription>
                View and analyze the model prediction
              </CardDescription>
            </CardHeader>
            <CardContent>
              {predictionResult ? (
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 bg-muted/40">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Prediction</p>
                        <p className="text-2xl font-bold">{predictionResult.prediction}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Confidence</p>
                        <p className="text-2xl font-bold">{predictionResult.confidence}%</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-muted-foreground">Model</p>
                        <p className="font-medium">{predictionResult.modelName}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Visualization</h4>
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="sm" 
                          variant={visualizationType === "bar" ? "default" : "outline"}
                          onClick={() => setVisualizationType("bar")}
                        >
                          <BarChart4 className="h-4 w-4 mr-1" /> Bar
                        </Button>
                        <Button 
                          size="sm" 
                          variant={visualizationType === "radar" ? "default" : "outline"}
                          onClick={() => setVisualizationType("radar")}
                        >
                          <LineChart className="h-4 w-4 mr-1" /> Radar
                        </Button>
                      </div>
                    </div>
                    
                    <div className="h-[300px]">
                      {visualizationType === "bar" ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={getChartData()}
                            margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill={(entry) => entry.color || "#4f46e5"} />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            data={getChartData()}
                          >
                            <PolarGrid />
                            <PolarAngleAxis dataKey="subject" />
                            <PolarRadiusAxis />
                            <Radar
                              name="Values"
                              dataKey="value"
                              stroke="#4f46e5"
                              fill="#4f46e5"
                              fillOpacity={0.6}
                            />
                            <Tooltip />
                          </RadarChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <BrainCircuit className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium mb-1">No Prediction Yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Adjust the parameters and click "Generate Prediction" to see results here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default ModelPrediction;
