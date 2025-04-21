
import { supabase } from "@/integrations/supabase/client";

/**
 * ML model metadata for the three target conditions:
 * - Diabetes: "diabetes"
 * - Heart Attack: "heartattack"
 * - Stroke: "stroke"
 */
export interface MLModel {
  id: string;
  family: "diabetes" | "heartattack" | "stroke";
  name: string;
  description?: string;
  modelUrl?: string;
  fileKey: string;
}

/**
 * Input schema for all models:
 * {
 *   Diabetes_012: number, HighBP: number, HighChol: number, CholCheck: number, BMI: number,
 *   Smoker: number, Stroke: number, HeartDiseaseorAttack: number, PhysActivity: number,
 *   Fruits: number, Veggies: number, HvyAlcoholConsump: number, AnyHealthcare: number,
 *   NoDocbcCost: number, GenHlth: number, MentHlth: number, PhysHlth: number,
 *   DiffWalk: number, Sex: number, Age: number, Education: number, Income: number, Diabetes_binary: number
 * }
 * (Note: the actual label for y/target varies per condition.)
 */

export interface ModelPrediction {
  modelId: string;
  modelName: string;
  prediction: number;
  confidence: number;
  inputData: Record<string, any>;
  timestamp: string;
}

// List of available models: update fileKey as per Supabase storage keys
export const AVAILABLE_MODELS: MLModel[] = [
  {
    id: "diabetes-svm",
    family: "diabetes",
    name: "Diabetes SVM",
    description: "SVM for Diabetes prediction",
    fileKey: "diabetes/svm.json"
  },
  {
    id: "diabetes-rf",
    family: "diabetes",
    name: "Diabetes Random Forest",
    description: "Random Forest for Diabetes prediction",
    fileKey: "diabetes/random-forest.json"
  },
  {
    id: "diabetes-xgboost",
    family: "diabetes",
    name: "Diabetes XGBoost",
    description: "XGBoost for Diabetes prediction",
    fileKey: "diabetes/xgboost.json"
  },
  {
    id: "diabetes-ann",
    family: "diabetes",
    name: "Diabetes ANN",
    description: "Neural Network for Diabetes prediction",
    fileKey: "diabetes/ann.json"
  },
  {
    id: "stroke-svm",
    family: "stroke",
    name: "Stroke SVM",
    description: "SVM for Stroke prediction",
    fileKey: "stroke/svm.json"
  },
  {
    id: "stroke-rf",
    family: "stroke",
    name: "Stroke Random Forest",
    description: "Random Forest for Stroke prediction",
    fileKey: "stroke/random-forest.json"
  },
  {
    id: "stroke-xgboost",
    family: "stroke",
    name: "Stroke XGBoost",
    description: "XGBoost for Stroke prediction",
    fileKey: "stroke/xgboost.json"
  },
  {
    id: "stroke-ann",
    family: "stroke",
    name: "Stroke ANN",
    description: "Neural Network for Stroke prediction",
    fileKey: "stroke/ann.json"
  },
  {
    id: "heartattack-svm",
    family: "heartattack",
    name: "HeartAttack SVM",
    description: "SVM for Heart Attack prediction",
    fileKey: "heartattack/svm.json"
  },
  {
    id: "heartattack-rf",
    family: "heartattack",
    name: "HeartAttack Random Forest",
    description: "Random Forest for Heart Attack prediction",
    fileKey: "heartattack/random-forest.json"
  },
  {
    id: "heartattack-xgboost",
    family: "heartattack",
    name: "HeartAttack XGBoost",
    description: "XGBoost for Heart Attack prediction",
    fileKey: "heartattack/xgboost.json"
  },
  {
    id: "heartattack-ann",
    family: "heartattack",
    name: "HeartAttack ANN",
    description: "Neural Network for Heart Attack prediction",
    fileKey: "heartattack/ann.json"
  },
];

// Fetches a signed URL for a model stored in Supabase Storage bucket
export const getModelSignedUrl = async (fileKey: string): Promise<string> => {
  // TODO: bucket name must match your Supabase Storage bucket
  const { data, error } = await supabase.storage
    .from('ml-models')
    .createSignedUrl(fileKey, 3600);

  if (error || !data?.signedUrl) {
    console.error("Error getting signed URL:", error);
    throw error ?? new Error("Unknown error getting signed URL");
  }

  return data.signedUrl;
};

// Loads the model (as JSON) from the signed URL
export const loadModel = async (modelId: string): Promise<any> => {
  const model = AVAILABLE_MODELS.find(m => m.id === modelId);
  if (!model) throw new Error(`Model with ID ${modelId} not found`);
  const signedUrl = await getModelSignedUrl(model.fileKey);
  const response = await fetch(signedUrl);
  if (!response.ok) throw new Error(`Failed to fetch model: ${response.statusText}`);
  return await response.json();
};

/**
 * Mock implementation of prediction (replace with real in-browser prediction if possible).
 * In reality, in-browser JS ML libraries would be needed.
 */
export const makePrediction = async (
  modelId: string,
  inputData: Record<string, any>
): Promise<ModelPrediction> => {
  const model = AVAILABLE_MODELS.find(m => m.id === modelId);
  if (!model) throw new Error(`Model with ID ${modelId} not found`);
  await new Promise(resolve => setTimeout(resolve, 500));
  // Return mock data
  const predictionValue = Math.random() * 100;
  const confidenceValue = 70 + Math.random() * 30;
  return {
    modelId,
    modelName: model.name,
    prediction: parseFloat(predictionValue.toFixed(2)),
    confidence: parseFloat(confidenceValue.toFixed(2)),
    inputData,
    timestamp: new Date().toISOString()
  };
};

// Commentary: Supabase table 'predictions' does not exist, so saving/fetching prediction history is disabled below.

// export const savePrediction = async (prediction: ModelPrediction): Promise<void> => {
//   // Not implemented: would need a predictions table with correct columns
// };

// export const getUserPredictions = async (): Promise<ModelPrediction[]> => {
//   // Not implemented
//   return [];
// };

