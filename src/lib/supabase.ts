import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase credentials
const supabaseUrl = 'https://ijtgnadrxgeonhapuanu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqdGduYWRyeGdlb25oYXB1YW51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxNzk5MzgsImV4cCI6MjA2MDc1NTkzOH0.dIWH0MKFNw3ax1Olf-qlXj_G-sOXKsCm_B1P7JS2YLU';
const MODEL_BUCKET_NAME = 'models'; // Replace with your bucket name

// Create Supabase client with proper configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  storage: {
    bucket: MODEL_BUCKET_NAME
  }
});

// Test function to verify bucket access
export async function testBucketAccess() {
  try {
    console.log('Testing bucket access...');
    const { data, error } = await supabase.storage
      .from(MODEL_BUCKET_NAME)
      .list();

    if (error) {
      console.error('Bucket access error:', error);
      return false;
    }

    console.log('Bucket access successful. Contents:', data);
    return true;
  } catch (error) {
    console.error('Error testing bucket access:', error);
    return false;
  }
}

// Function to download a model from storage
export async function downloadModel(modelPath: string) {
  try {
    console.log('Downloading model from path:', modelPath);
    const { data, error } = await supabase.storage
      .from(MODEL_BUCKET_NAME)
      .download(modelPath);

    if (error) {
      console.error('Error downloading model:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in downloadModel:', error);
    throw error;
  }
}

// Function to list all models in the bucket
export async function listModels() {
  try {
    console.log('Listing models from bucket:', MODEL_BUCKET_NAME);
    const { data, error } = await supabase.storage
      .from(MODEL_BUCKET_NAME)
      .list();

    if (error) {
      console.error('Error listing models:', error);
      throw error;
    }

    console.log('Found models:', data);
    return data;
  } catch (error) {
    console.error('Error in listModels:', error);
    throw error;
  }
}

// Function to get model URL
export function getModelUrl(modelPath: string) {
  const url = `${supabaseUrl}/storage/v1/object/public/${MODEL_BUCKET_NAME}/${modelPath}`;
  console.log('Generated model URL:', url);
  return url;
}

// Function to make predictions using a model
export async function makePrediction(bucketName: string, modelPath: string, inputData: any) {
  try {
    // 1. Download the model
    const modelBlob = await downloadModel(modelPath);
    
    // 2. Convert blob to model (this depends on your ML framework)
    // For example, if using TensorFlow.js:
    // const model = await tf.loadLayersModel(URL.createObjectURL(modelBlob));
    
    // 3. Make prediction
    // const prediction = await model.predict(inputData);
    
    // 4. Return the prediction
    return {
      success: true,
      prediction: "Your prediction result" // Replace with actual prediction
    };
  } catch (error) {
    console.error('Error making prediction:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Example usage in your component
const makeHealthPrediction = async (inputData) => {
  const result = await makePrediction(
    'your-bucket-name',
    'path/to/your/model',
    inputData
  );
  
  if (result.success) {
    // Use the prediction
    console.log('Prediction:', result.prediction);
  } else {
    // Handle error
    console.error('Prediction failed:', result.error);
  }
};

const MODEL_PATHS = {
  diabetes: {
    nn: 'diabetes/Diabetes_binary_NN.h5',
    nn_scaler: 'diabetes/Diabetes_binary_NN_scaler.pkl',
    svm: 'diabetes/Diabetes_binary_SVM.pkl',
    xgboost: 'diabetes/Diabetes_binary_XGBoost.pkl'
  },
  stroke: {
    nn: 'stroke/Stroke_NN.h5',
    nn_scaler: 'stroke/Stroke_NN_scaler.pkl',
    svm: 'stroke/Stroke_SVM.pkl',
    xgboost: 'stroke/Stroke_XGBoost.pkl'
  },
  heart: {
    nn: 'heart/HeartDiseaseorAttack_NN.h5',
    nn_scaler: 'heart/HeartDiseaseorAttack_NN_scaler.pkl',
    svm: 'heart/HeartDiseaseorAttack_SVM.pkl',
    xgboost: 'heart/HeartDiseaseorAttack_XGBoost.pkl'
  }
}; 