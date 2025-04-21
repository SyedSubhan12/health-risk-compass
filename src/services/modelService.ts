
import { supabase } from "@/integrations/supabase/client";

export interface MLModel {
  id: string;
  name: string;
  description?: string;
  modelUrl?: string;
  fileKey: string;
  type: "diabetes" | "heartattack" | "stroke";
  algorithm: "svm" | "random-forest" | "xgboost" | "ann";
}

export interface ModelPrediction {
  modelId: string;
  modelName: string;
  prediction: number;
  confidence: number;
  inputData: Record<string, any>;
  timestamp: string;
}

// Predefined health risk models available in the application
export const AVAILABLE_MODELS: MLModel[] = [
  // Diabetes models
  {
    id: "diabetes-random-forest",
    name: "Diabetes Risk (Random Forest)",
    description: "Predicts diabetes risk using Random Forest algorithm",
    fileKey: "models/diabetes/random-forest.json",
    type: "diabetes",
    algorithm: "random-forest"
  },
  {
    id: "diabetes-svm",
    name: "Diabetes Risk (SVM)",
    description: "Predicts diabetes risk using Support Vector Machine",
    fileKey: "models/diabetes/svm.json",
    type: "diabetes",
    algorithm: "svm"
  },
  {
    id: "diabetes-xgboost",
    name: "Diabetes Risk (XGBoost)",
    description: "Predicts diabetes risk using XGBoost",
    fileKey: "models/diabetes/xgboost.json",
    type: "diabetes",
    algorithm: "xgboost"
  },
  {
    id: "diabetes-ann",
    name: "Diabetes Risk (Neural Network)",
    description: "Predicts diabetes risk using Artificial Neural Network",
    fileKey: "models/diabetes/ann.json",
    type: "diabetes",
    algorithm: "ann"
  },
  
  // Heart Attack models
  {
    id: "heartattack-random-forest",
    name: "Heart Attack Risk (Random Forest)",
    description: "Predicts heart attack risk using Random Forest algorithm",
    fileKey: "models/heartattack/random-forest.json",
    type: "heartattack",
    algorithm: "random-forest"
  },
  {
    id: "heartattack-svm",
    name: "Heart Attack Risk (SVM)",
    description: "Predicts heart attack risk using Support Vector Machine",
    fileKey: "models/heartattack/svm.json",
    type: "heartattack",
    algorithm: "svm"
  },
  {
    id: "heartattack-xgboost",
    name: "Heart Attack Risk (XGBoost)",
    description: "Predicts heart attack risk using XGBoost",
    fileKey: "models/heartattack/xgboost.json",
    type: "heartattack",
    algorithm: "xgboost"
  },
  {
    id: "heartattack-ann",
    name: "Heart Attack Risk (Neural Network)",
    description: "Predicts heart attack risk using Artificial Neural Network",
    fileKey: "models/heartattack/ann.json",
    type: "heartattack",
    algorithm: "ann"
  },
  
  // Stroke models
  {
    id: "stroke-random-forest",
    name: "Stroke Risk (Random Forest)",
    description: "Predicts stroke risk using Random Forest algorithm",
    fileKey: "models/stroke/random-forest.json",
    type: "stroke",
    algorithm: "random-forest"
  },
  {
    id: "stroke-svm",
    name: "Stroke Risk (SVM)",
    description: "Predicts stroke risk using Support Vector Machine",
    fileKey: "models/stroke/svm.json",
    type: "stroke",
    algorithm: "svm"
  },
  {
    id: "stroke-xgboost",
    name: "Stroke Risk (XGBoost)",
    description: "Predicts stroke risk using XGBoost",
    fileKey: "models/stroke/xgboost.json",
    type: "stroke",
    algorithm: "xgboost"
  },
  {
    id: "stroke-ann",
    name: "Stroke Risk (Neural Network)",
    description: "Predicts stroke risk using Artificial Neural Network",
    fileKey: "models/stroke/ann.json",
    type: "stroke",
    algorithm: "ann"
  }
];

// Define the features required for each model type
export const MODEL_FEATURES = {
  diabetes: [
    "HighBP", "HighChol", "CholCheck", "BMI", "Smoker", "Stroke", 
    "HeartDiseaseorAttack", "PhysActivity", "Fruits", "Veggies", 
    "HvyAlcoholConsump", "AnyHealthcare", "NoDocbcCost", "GenHlth", 
    "MentHlth", "PhysHlth", "DiffWalk", "Sex", "Age", "Education", "Income"
  ],
  heartattack: [
    "HighBP", "HighChol", "CholCheck", "BMI", "Smoker", "Stroke", 
    "PhysActivity", "Fruits", "Veggies", "HvyAlcoholConsump", 
    "AnyHealthcare", "NoDocbcCost", "GenHlth", "MentHlth", "PhysHlth", 
    "DiffWalk", "Sex", "Age", "Education", "Income", "Diabetes_012", "Diabetes_binary"
  ],
  stroke: [
    "HighBP", "HighChol", "CholCheck", "BMI", "Smoker", 
    "HeartDiseaseorAttack", "PhysActivity", "Fruits", "Veggies", 
    "HvyAlcoholConsump", "AnyHealthcare", "NoDocbcCost", "GenHlth", 
    "MentHlth", "PhysHlth", "DiffWalk", "Sex", "Age", "Education", 
    "Income", "Diabetes_012", "Diabetes_binary"
  ]
};

/**
 * Fetches a signed URL for a model file stored in Supabase
 */
export const getModelSignedUrl = async (fileKey: string): Promise<string> => {
  const { data, error } = await supabase.storage
    .from('ml-models')
    .createSignedUrl(fileKey, 3600); // URL valid for 1 hour

  if (error) {
    console.error("Error getting signed URL:", error);
    throw error;
  }

  return data.signedUrl;
};

/**
 * Loads a model from Supabase storage
 */
export const loadModel = async (modelId: string): Promise<any> => {
  const model = AVAILABLE_MODELS.find(m => m.id === modelId);
  
  if (!model) {
    throw new Error(`Model with ID ${modelId} not found`);
  }

  try {
    // Get a signed URL for the model file
    const signedUrl = await getModelSignedUrl(model.fileKey);
    
    // Fetch the model data
    const response = await fetch(signedUrl);
    if (!response.ok) {
      throw new Error(`Failed to load model: ${response.statusText}`);
    }
    
    const modelData = await response.json();
    return modelData;
  } catch (error) {
    console.error(`Error loading model ${modelId}:`, error);
    throw error;
  }
};

/**
 * Makes a prediction using the specified model
 * This is a mock implementation using predefined features from the model type
 */
export const makePrediction = async (
  modelId: string,
  inputData: Record<string, any>
): Promise<ModelPrediction> => {
  const model = AVAILABLE_MODELS.find(m => m.id === modelId);
  if (!model) {
    throw new Error(`Model with ID ${modelId} not found`);
  }

  // In a real implementation, you would:
  // 1. Verify the input data contains all required features for the model type
  // 2. Load the model from storage
  // 3. Use appropriate algorithm to make prediction
  // 4. Return the result

  // For demonstration purposes, we'll generate a random prediction
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate processing time

  // Generate prediction value between 0 and 1 (for classification)
  const predictionValue = Math.random();
  const confidenceValue = 70 + Math.random() * 25; // 70-95% confidence
  
  return {
    modelId,
    modelName: model.name,
    prediction: Number(predictionValue.toFixed(2)),
    confidence: Number(confidenceValue.toFixed(2)),
    inputData,
    timestamp: new Date().toISOString()
  };
};

/**
 * Saves a prediction to the user's history
 * This would store the prediction in a database in a real implementation
 */
export const savePrediction = async (prediction: ModelPrediction): Promise<void> => {
  // Since predictions table is not available in the database schema yet,
  // we're implementing this as a mock function that logs the prediction
  console.log("Prediction saved:", prediction);
};

/**
 * Fetches prediction history for the current user
 * This would retrieve predictions from the database in a real implementation
 */
export const getUserPredictions = async (): Promise<ModelPrediction[]> => {
  // Return mock data since we don't have a predictions table yet
  console.log("Fetching user predictions (mock)");
  
  return [];
};
