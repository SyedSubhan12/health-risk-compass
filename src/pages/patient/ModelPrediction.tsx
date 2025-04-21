
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PageContainer, PageHeader } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { AVAILABLE_MODELS, MLModel, makePrediction } from "@/services/modelService";
import { ArrowLeft, BrainCircuit, BarChart4, LineChart, Layers } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { useAuth } from "@/contexts/AuthContext";

// Input fields for BRFSS-style models
const FIELD_META = [
  { name: "Diabetes_012", label: "Diabetes_012", min: 0, max: 2, type: "number", defaultValue: 0 },
  { name: "HighBP", label: "HighBP", min: 0, max: 1, type: "number", defaultValue: 0 },
  { name: "HighChol", label: "HighChol", min: 0, max: 1, type: "number", defaultValue: 0 },
  { name: "CholCheck", label: "CholCheck", min: 0, max: 1, type: "number", defaultValue: 1 },
  { name: "BMI", label: "BMI", min: 10, max: 80, type: "number", defaultValue: 25 },
  { name: "Smoker", label: "Smoker", min: 0, max: 1, type: "number", defaultValue: 0 },
  { name: "Stroke", label: "Stroke", min: 0, max: 1, type: "number", defaultValue: 0 },
  { name: "HeartDiseaseorAttack", label: "HeartDiseaseorAttack", min: 0, max: 1, type: "number", defaultValue: 0 },
  { name: "PhysActivity", label: "PhysActivity", min: 0, max: 1, type: "number", defaultValue: 1 },
  { name: "Fruits", label: "Fruits", min: 0, max: 1, type: "number", defaultValue: 1 },
  { name: "Veggies", label: "Veggies", min: 0, max: 1, type: "number", defaultValue: 1 },
  { name: "HvyAlcoholConsump", label: "HvyAlcoholConsump", min: 0, max: 1, type: "number", defaultValue: 0 },
  { name: "AnyHealthcare", label: "AnyHealthcare", min: 0, max: 1, type: "number", defaultValue: 1 },
  { name: "NoDocbcCost", label: "NoDocbcCost", min: 0, max: 1, type: "number", defaultValue: 0 },
  { name: "GenHlth", label: "GenHlth", min: 1, max: 5, type: "number", defaultValue: 3 },
  { name: "MentHlth", label: "MentHlth", min: 0, max: 30, type: "number", defaultValue: 0 },
  { name: "PhysHlth", label: "PhysHlth", min: 0, max: 30, type: "number", defaultValue: 0 },
  { name: "DiffWalk", label: "DiffWalk", min: 0, max: 1, type: "number", defaultValue: 0 },
  { name: "Sex", label: "Sex", min: 0, max: 1, type: "number", defaultValue: 0 },
  { name: "Age", label: "Age", min: 1, max: 13, type: "number", defaultValue: 7 },
  { name: "Education", label: "Education", min: 1, max: 6, type: "number", defaultValue: 3 },
  { name: "Income", label: "Income", min: 1, max: 8, type: "number", defaultValue: 3 },
  { name: "Diabetes_binary", label: "Diabetes_binary", min: 0, max: 1, type: "number", defaultValue: 0 }
];

const getTargetFields = (family: MLModel["family"]) => {
  if (family === "diabetes") return ["Diabetes_012", "Diabetes_binary"];
  if (family === "heartattack") return ["HeartDiseaseorAttack"];
  if (family === "stroke") return ["Stroke"];
  return [];
};

const ModelPredictionPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedModelId, setSelectedModelId] = useState<string>(AVAILABLE_MODELS[0].id);
  const [inputValues, setInputValues] = useState<Record<string, any>>(() => (
    FIELD_META.reduce((acc, f) => ({ ...acc, [f.name]: f.defaultValue }), {})
  ));
  const [predictionResult, setPredictionResult] = useState<ReturnType<typeof makePrediction> extends Promise<infer T> ? T : never | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [visualizationType, setVisualizationType] = useState<"bar" | "radar">("bar");

  const selectedModel: MLModel = AVAILABLE_MODELS.find(model => model.id === selectedModelId) || AVAILABLE_MODELS[0];
  const targetFields = useMemo(() => getTargetFields(selectedModel.family), [selectedModel.family]);

  // Filter out target variables from the form
  const filteredFields = FIELD_META.filter(field => !targetFields.includes(field.name));

  const handleInputChange = (name: string, value: any) => {
    setInputValues(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const filteredInput = Object.fromEntries(
        Object.entries(inputValues).filter(([key]) => !targetFields.includes(key))
      );
      const result = await makePrediction(selectedModelId, filteredInput);
      setPredictionResult(result);
      toast.success("Prediction completed successfully!");
    } catch (error) {
      console.error("Prediction error:", error);
      toast.error("Failed to make prediction. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getChartData = () => {
    if (!predictionResult) return [];

    if (visualizationType === "bar") {
      return [
        { name: "Prediction", value: predictionResult.prediction, color: "#4f46e5" },
        { name: "Confidence", value: predictionResult.confidence, color: "#06b6d4" }
      ];
    }
    // Radar: show each input variable value
    return Object.entries(predictionResult.inputData).map(([key, value]) => ({
      subject: key,
      value: typeof value === 'number' ? value : Number(value),
      fullMark: 100
    }));
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
        {/* Input and model selector */}
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
                  Adjust input for {selectedModel.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredFields.map((field) => (
                    <div key={field.name} className="space-y-2">
                      <Label htmlFor={field.name}>{field.label}</Label>
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
                          ({field.min} - {field.max})
                        </span>
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
        {/* Result Visualization */}
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
                            <Bar dataKey="value" fill="#4f46e5" />
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

export default ModelPredictionPage;
