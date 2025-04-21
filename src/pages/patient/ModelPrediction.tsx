
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  AVAILABLE_MODELS, 
  MODEL_FEATURES,
  MLModel, 
  makePrediction, 
  type ModelPrediction as ModelPredictionType 
} from "@/services/modelService";
import { ArrowLeft, Brain, HeartPulse, Activity, BarChart4, LineChart, Layers } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface InputField {
  name: string;
  label: string;
  type: "number" | "slider" | "select" | "radio";
  min?: number;
  max?: number;
  options?: string[] | number[];
  defaultValue: number | string;
  description?: string;
}

// Define input fields for the health parameters
const HEALTH_INPUT_FIELDS: Record<string, InputField> = {
  "HighBP": {
    name: "HighBP",
    label: "High Blood Pressure",
    type: "radio",
    options: ["No", "Yes"],
    defaultValue: "No",
    description: "Have you been told you have high blood pressure?"
  },
  "HighChol": {
    name: "HighChol",
    label: "High Cholesterol",
    type: "radio",
    options: ["No", "Yes"],
    defaultValue: "No",
    description: "Have you been told you have high cholesterol?"
  },
  "CholCheck": {
    name: "CholCheck",
    label: "Cholesterol Check",
    type: "radio",
    options: ["No", "Yes"],
    defaultValue: "Yes",
    description: "Have you had your cholesterol checked in the past 5 years?"
  },
  "BMI": {
    name: "BMI",
    label: "BMI",
    type: "number",
    min: 10,
    max: 60,
    defaultValue: 25,
    description: "Body Mass Index (weight in kg/(height in m)²)"
  },
  "Smoker": {
    name: "Smoker",
    label: "Smoker",
    type: "radio",
    options: ["No", "Yes"],
    defaultValue: "No",
    description: "Have you smoked at least 100 cigarettes in your entire life?"
  },
  "Stroke": {
    name: "Stroke",
    label: "Stroke History",
    type: "radio",
    options: ["No", "Yes"],
    defaultValue: "No",
    description: "Have you ever been told you had a stroke?"
  },
  "HeartDiseaseorAttack": {
    name: "HeartDiseaseorAttack",
    label: "Heart Disease/Attack",
    type: "radio",
    options: ["No", "Yes"],
    defaultValue: "No",
    description: "Have you ever been told you had coronary heart disease or a heart attack?"
  },
  "PhysActivity": {
    name: "PhysActivity",
    label: "Physical Activity",
    type: "radio",
    options: ["No", "Yes"],
    defaultValue: "Yes",
    description: "Have you engaged in physical activity in past 30 days?"
  },
  "Fruits": {
    name: "Fruits",
    label: "Fruits Consumption",
    type: "radio",
    options: ["No", "Yes"],
    defaultValue: "Yes",
    description: "Do you consume fruit once or more per day?"
  },
  "Veggies": {
    name: "Veggies",
    label: "Vegetables Consumption",
    type: "radio",
    options: ["No", "Yes"],
    defaultValue: "Yes",
    description: "Do you consume vegetables once or more per day?"
  },
  "HvyAlcoholConsump": {
    name: "HvyAlcoholConsump",
    label: "Heavy Alcohol Consumption",
    type: "radio",
    options: ["No", "Yes"],
    defaultValue: "No",
    description: "Heavy alcohol consumption (adult men >=14 drinks per week, adult women>=7 drinks per week)"
  },
  "AnyHealthcare": {
    name: "AnyHealthcare",
    label: "Healthcare Coverage",
    type: "radio",
    options: ["No", "Yes"],
    defaultValue: "Yes",
    description: "Do you have any kind of health care coverage?"
  },
  "NoDocbcCost": {
    name: "NoDocbcCost",
    label: "Medical Cost Barrier",
    type: "radio",
    options: ["No", "Yes"],
    defaultValue: "No",
    description: "Was there a time in the past 12 months when you needed to see a doctor but could not because of cost?"
  },
  "GenHlth": {
    name: "GenHlth",
    label: "General Health",
    type: "select",
    options: [1, 2, 3, 4, 5],
    defaultValue: 3,
    description: "Would you say that in general your health is: 1=excellent, 2=very good, 3=good, 4=fair, 5=poor"
  },
  "MentHlth": {
    name: "MentHlth",
    label: "Mental Health Days",
    type: "slider",
    min: 0,
    max: 30,
    defaultValue: 0,
    description: "Now thinking about your mental health, for how many days during the past 30 days was your mental health not good?"
  },
  "PhysHlth": {
    name: "PhysHlth",
    label: "Physical Health Days",
    type: "slider",
    min: 0,
    max: 30,
    defaultValue: 0,
    description: "Now thinking about your physical health, for how many days during the past 30 days was your physical health not good?"
  },
  "DiffWalk": {
    name: "DiffWalk",
    label: "Difficulty Walking",
    type: "radio",
    options: ["No", "Yes"],
    defaultValue: "No",
    description: "Do you have serious difficulty walking or climbing stairs?"
  },
  "Sex": {
    name: "Sex",
    label: "Sex",
    type: "select",
    options: [0, 1],
    defaultValue: 0,
    description: "0 = female, 1 = male"
  },
  "Age": {
    name: "Age",
    label: "Age Category",
    type: "select",
    options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    defaultValue: 5,
    description: "Age category (1=18-24, 2=25-29, 3=30-34, 4=35-39, 5=40-44, 6=45-49, 7=50-54, 8=55-59, 9=60-64, 10=65-69, 11=70-74, 12=75-79, 13=80+)"
  },
  "Education": {
    name: "Education",
    label: "Education Level",
    type: "select",
    options: [1, 2, 3, 4, 5, 6],
    defaultValue: 4,
    description: "Education level (1=Never attended school, 2=Elementary, 3=Some high school, 4=High school graduate, 5=Some college or technical school, 6=College graduate)"
  },
  "Income": {
    name: "Income",
    label: "Income Level",
    type: "select",
    options: [1, 2, 3, 4, 5, 6, 7, 8],
    defaultValue: 5,
    description: "Income level (1=<$10K, 2=$10-15K, 3=$15-20K, 4=$20-25K, 5=$25-35K, 6=$35-50K, 7=$50-75K, 8=>$75K)"
  },
  "Diabetes_012": {
    name: "Diabetes_012",
    label: "Diabetes Status",
    type: "select",
    options: [0, 1, 2],
    defaultValue: 0,
    description: "0 = no diabetes, 1 = prediabetes, 2 = diabetes"
  },
  "Diabetes_binary": {
    name: "Diabetes_binary",
    label: "Diabetes Binary",
    type: "radio",
    options: ["No", "Yes"],
    defaultValue: "No",
    description: "0 = no diabetes or prediabetes, 1 = diabetes or prediabetes"
  }
};

const ModelPrediction: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedModelType, setSelectedModelType] = useState<"diabetes" | "heartattack" | "stroke">("diabetes");
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<"svm" | "random-forest" | "xgboost" | "ann">("random-forest");
  const [inputValues, setInputValues] = useState<Record<string, any>>(() => {
    // Initialize with default values
    const initialValues: Record<string, any> = {};
    Object.values(HEALTH_INPUT_FIELDS).forEach(field => {
      initialValues[field.name] = field.defaultValue;
    });
    return initialValues;
  });
  const [predictionResult, setPredictionResult] = useState<ModelPredictionType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [visualizationType, setVisualizationType] = useState<"bar" | "radar">("bar");

  // Get the relevant features for the selected model type
  const relevantFeatures = MODEL_FEATURES[selectedModelType] || [];
  
  // Find the selected model based on type and algorithm
  const selectedModelId = `${selectedModelType}-${selectedAlgorithm}`;
  const selectedModel = AVAILABLE_MODELS.find(model => model.id === selectedModelId) || AVAILABLE_MODELS[0];

  // Convert string "Yes"/"No" to numeric values for prediction
  const prepareInputForPrediction = () => {
    const preparedInput: Record<string, any> = {};
    
    Object.entries(inputValues).forEach(([key, value]) => {
      if (value === "Yes") {
        preparedInput[key] = 1;
      } else if (value === "No") {
        preparedInput[key] = 0;
      } else {
        preparedInput[key] = value;
      }
    });
    
    return preparedInput;
  };

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
      const preparedInput = prepareInputForPrediction();
      const result = await makePrediction(selectedModelId, preparedInput);
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
          name: "Risk Score",
          value: predictionResult.prediction * 100,
          color: "#4f46e5"
        },
        {
          name: "Confidence",
          value: predictionResult.confidence,
          color: "#06b6d4"
        }
      ];
    }

    // For radar chart - multiple factors from input data
    // Select a subset of important factors to display
    const importantFactors = [
      "BMI", "Age", "HighBP", "HighChol", "Smoker", 
      "PhysActivity", "GenHlth", "MentHlth", "PhysHlth"
    ];
    
    return importantFactors
      .filter(factor => factor in predictionResult.inputData)
      .map(factor => {
        // Normalize values for radar chart
        let value = predictionResult.inputData[factor];
        
        // Convert binary values for better visualization
        if (value === 0 || value === 1) {
          value = value * 100;
        }
        
        // Scale some values to make them visible in the radar chart
        if (factor === "BMI") {
          value = (value / 60) * 100; // Normalize BMI to percentage
        } else if (factor === "Age") {
          value = (value / 13) * 100; // Normalize age category
        } else if (factor === "GenHlth") {
          value = (value / 5) * 100; // Normalize general health
        } else if (factor === "MentHlth" || factor === "PhysHlth") {
          value = (value / 30) * 100; // Normalize health days
        }
        
        return {
          subject: HEALTH_INPUT_FIELDS[factor]?.label || factor,
          value: value,
          fullMark: 100
        };
      });
  };

  // Get the icon based on model type
  const getModelIcon = () => {
    switch(selectedModelType) {
      case "diabetes":
        return <Activity className="mr-2 h-5 w-5" />;
      case "heartattack":
        return <HeartPulse className="mr-2 h-5 w-5" />;
      case "stroke":
        return <Brain className="mr-2 h-5 w-5" />;
      default:
        return <Activity className="mr-2 h-5 w-5" />;
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Health Risk Analysis"
        description="Analyze your health data to estimate risk levels for various conditions"
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
                {getModelIcon()} Health Risk Model
              </CardTitle>
              <CardDescription>
                Select a health condition and preferred algorithm to analyze your risk
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                defaultValue="diabetes"
                value={selectedModelType}
                onValueChange={(value) => setSelectedModelType(value as "diabetes" | "heartattack" | "stroke")}
                className="mb-4"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="diabetes" className="flex items-center">
                    <Activity className="mr-2 h-4 w-4" /> Diabetes
                  </TabsTrigger>
                  <TabsTrigger value="heartattack" className="flex items-center">
                    <HeartPulse className="mr-2 h-4 w-4" /> Heart Attack
                  </TabsTrigger>
                  <TabsTrigger value="stroke" className="flex items-center">
                    <Brain className="mr-2 h-4 w-4" /> Stroke
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="mb-4">
                <Label>Algorithm</Label>
                <RadioGroup
                  value={selectedAlgorithm}
                  onValueChange={(value) => setSelectedAlgorithm(value as "svm" | "random-forest" | "xgboost" | "ann")}
                  className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2"
                >
                  <div className={`border rounded-md p-3 ${selectedAlgorithm === "random-forest" ? "border-primary bg-primary/10" : ""}`}>
                    <RadioGroupItem value="random-forest" id="random-forest" className="hidden" />
                    <Label htmlFor="random-forest" className="flex flex-col cursor-pointer">
                      <span className="font-medium">Random Forest</span>
                      <span className="text-xs text-muted-foreground">Ensemble decision trees</span>
                    </Label>
                  </div>
                  
                  <div className={`border rounded-md p-3 ${selectedAlgorithm === "svm" ? "border-primary bg-primary/10" : ""}`}>
                    <RadioGroupItem value="svm" id="svm" className="hidden" />
                    <Label htmlFor="svm" className="flex flex-col cursor-pointer">
                      <span className="font-medium">SVM</span>
                      <span className="text-xs text-muted-foreground">Support Vector Machine</span>
                    </Label>
                  </div>
                  
                  <div className={`border rounded-md p-3 ${selectedAlgorithm === "xgboost" ? "border-primary bg-primary/10" : ""}`}>
                    <RadioGroupItem value="xgboost" id="xgboost" className="hidden" />
                    <Label htmlFor="xgboost" className="flex flex-col cursor-pointer">
                      <span className="font-medium">XGBoost</span>
                      <span className="text-xs text-muted-foreground">Gradient boosting</span>
                    </Label>
                  </div>
                  
                  <div className={`border rounded-md p-3 ${selectedAlgorithm === "ann" ? "border-primary bg-primary/10" : ""}`}>
                    <RadioGroupItem value="ann" id="ann" className="hidden" />
                    <Label htmlFor="ann" className="flex flex-col cursor-pointer">
                      <span className="font-medium">Neural Network</span>
                      <span className="text-xs text-muted-foreground">Deep learning</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Health Parameters</CardTitle>
                <CardDescription>
                  Provide your health information for the {selectedModel.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {relevantFeatures.map((featureName) => {
                    const field = HEALTH_INPUT_FIELDS[featureName];
                    if (!field) return null;
                    
                    return (
                      <div key={field.name} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label htmlFor={field.name}>{field.label}</Label>
                          {field.description && (
                            <span className="text-xs text-muted-foreground hover:text-foreground cursor-help" title={field.description}>
                              ℹ️
                            </span>
                          )}
                        </div>
                        
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
                            value={inputValues[field.name].toString()} 
                            onValueChange={(value) => {
                              // Convert value to number if it's numeric
                              const parsedValue = isNaN(Number(value)) ? value : Number(value);
                              handleInputChange(field.name, parsedValue);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={`Select ${field.label}`} />
                            </SelectTrigger>
                            <SelectContent>
                              {field.options.map((option) => (
                                <SelectItem key={option.toString()} value={option.toString()}>
                                  {option.toString()}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                        
                        {field.type === "radio" && field.options && (
                          <RadioGroup
                            value={inputValues[field.name].toString()}
                            onValueChange={(value) => handleInputChange(field.name, value)}
                            className="flex space-x-4"
                          >
                            {field.options.map((option) => (
                              <div key={option.toString()} className="flex items-center space-x-2">
                                <RadioGroupItem value={option.toString()} id={`${field.name}-${option}`} />
                                <Label htmlFor={`${field.name}-${option}`}>{option.toString()}</Label>
                              </div>
                            ))}
                          </RadioGroup>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Processing..." : "Generate Risk Analysis"}
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
                <Layers className="mr-2 h-5 w-5" /> Risk Analysis Results
              </CardTitle>
              <CardDescription>
                View and analyze your health risk assessment
              </CardDescription>
            </CardHeader>
            <CardContent>
              {predictionResult ? (
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 bg-muted/40">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Risk Score</p>
                        <p className="text-2xl font-bold">{(predictionResult.prediction * 100).toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Confidence</p>
                        <p className="text-2xl font-bold">{predictionResult.confidence.toFixed(1)}%</p>
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
                            <Bar dataKey="value" fill="#4f46e5" name="Value" />
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
                              name="Value"
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
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-medium mb-2">Risk Interpretation</h4>
                    <p className="text-sm">
                      {predictionResult.prediction < 0.3 
                        ? "Low risk: Continue maintaining your healthy lifestyle and regular check-ups."
                        : predictionResult.prediction < 0.7
                        ? "Moderate risk: Consider discussing these results with your healthcare provider at your next visit."
                        : "High risk: We recommend scheduling an appointment with your healthcare provider to discuss these results soon."
                      }
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Brain className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium mb-1">No Analysis Yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Fill in your health information and click "Generate Risk Analysis" to see results here.
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
