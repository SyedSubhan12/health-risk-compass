import { downloadModel, getModelUrl } from '@/lib/supabase';
import * as tf from '@tensorflow/tfjs';
import { loadModel } from '@tensorflow/tfjs-converter';

// Define model types and their paths
const MODEL_PATHS = {
  diabetes: {
    nn: 'models/Diabetes_binary_NN.h5',
    nn_scaler: 'models/Diabetes_binary_NN_scaler.pkl',
    svm: 'models/Diabetes_binary_SVM.pkl',
    xgboost: 'models/Diabetes_binary_XGBoost.pkl'
  },
  stroke: {
    nn: 'models/Stroke_NN.h5',
    nn_scaler: 'models/Stroke_NN_scaler.pkl',
    svm: 'models/Stroke_SVM.pkl',
    xgboost: 'models/Stroke_XGBoost.pkl'
  },
  heart: {
    nn: 'models/HeartDiseaseorAttack_NN.h5',
    nn_scaler: 'models/HeartDiseaseorAttack_NN_scaler.pkl',
    svm: 'models/HeartDiseaseorAttack_SVM.pkl',
    xgboost: 'models/HeartDiseaseorAttack_XGBoost.pkl'
  }
};

export type ModelType = 'diabetes' | 'stroke' | 'heart';
export type AlgorithmType = 'nn' | 'svm' | 'xgboost';

export interface PredictionInput {
  // Add your form fields here based on your model's input requirements
  age: number;
  gender: string;
  // Add other fields as needed
}

export class PredictionService {
  private static async loadPickleModel(modelPath: string) {
    const modelBlob = await downloadModel(modelPath);
    // Convert .pkl to TensorFlow.js format
    // You'll need to implement the conversion logic here
    return modelBlob;
  }

  private static async loadH5Model(modelPath: string) {
    const modelUrl = getModelUrl(modelPath);
    return await tf.loadLayersModel(modelUrl);
  }

  public static async makePrediction(
    modelType: ModelType,
    algorithm: AlgorithmType,
    inputData: PredictionInput
  ) {
    try {
      const modelPath = MODEL_PATHS[modelType][algorithm];
      let model;
      let scaler;

      if (algorithm === 'nn') {
        // Load both model and scaler for neural networks
        model = await this.loadH5Model(modelPath);
        const scalerPath = MODEL_PATHS[modelType].nn_scaler;
        scaler = await this.loadPickleModel(scalerPath);
      } else {
        // Load SVM or XGBoost model
        model = await this.loadPickleModel(modelPath);
      }

      // Convert input data to tensor
      const inputTensor = tf.tensor2d([
        // Convert your input data to the format your model expects
        [inputData.age, /* other numeric values */]
      ]);

      // Make prediction
      const prediction = await model.predict(inputTensor);
      
      // Convert prediction to readable format
      const result = await prediction.data();
      
      return {
        success: true,
        prediction: result[0],
        confidence: Math.max(...result) * 100
      };
    } catch (error) {
      console.error('Prediction error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
} 