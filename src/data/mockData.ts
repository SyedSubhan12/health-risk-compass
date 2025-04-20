// Mock data for the health risk prediction system

// Health Risk Types
export type HealthRiskType = 
  | "diabetes" 
  | "heartDisease" 
  | "hypertension" 
  | "obesity" 
  | "stroke";

// Risk Level Type
export type RiskLevel = "low" | "moderate" | "high";

// Health Risk Interface
export interface HealthRisk {
  id: string;
  type: HealthRiskType;
  score: number;
  maxScore: number;
  level: RiskLevel;
  lastUpdated: string;
  recommendation: string;
}

// Interface for doctor profile
export interface DoctorSummary {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  availability: string;
}

// User Health Profile
export interface HealthProfile {
  userId: string;
  healthRisks: HealthRisk[];
  recentMeasurements: {
    bloodPressure: string;
    glucoseLevel: number;
    cholesterol: number;
    bmi: number;
    lastUpdated: string;
  };
  generalRecommendation: string;
  assignedDoctor?: DoctorSummary; // Make it optional with "?"
}

// Doctor Profile
export interface DoctorProfile {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  availability: string;
  imageUrl: string;
  bio: string;
}

// Patient Profile (for doctor's view)
export interface PatientSummary {
  id: string;
  name: string;
  age: number;
  highestRisk: {
    type: HealthRiskType;
    level: RiskLevel;
  };
  lastCheckup: string;
  hasNewResults: boolean;
}

// Past Prediction
export interface PastPrediction {
  id: string;
  date: string;
  healthRisks: {
    type: HealthRiskType;
    score: number;
    level: RiskLevel;
  }[];
  doctorNote?: string;
}

// Mock Health Risks for Patient
export const mockPatientHealthRisks: HealthRisk[] = [
  {
    id: "risk-1",
    type: "diabetes",
    score: 35,
    maxScore: 100,
    level: "moderate",
    lastUpdated: "2025-04-15",
    recommendation: "Monitor your blood sugar levels regularly and reduce sugar intake."
  },
  {
    id: "risk-2",
    type: "heartDisease",
    score: 22,
    maxScore: 100,
    level: "low",
    lastUpdated: "2025-04-15",
    recommendation: "Maintain regular cardiovascular exercise at least 3 times a week."
  },
  {
    id: "risk-3",
    type: "hypertension",
    score: 68,
    maxScore: 100,
    level: "high",
    lastUpdated: "2025-04-15",
    recommendation: "Reduce sodium intake and consider medication options with your doctor."
  },
  {
    id: "risk-4",
    type: "obesity",
    score: 42,
    maxScore: 100,
    level: "moderate",
    lastUpdated: "2025-04-15",
    recommendation: "Aim for a balanced diet with calorie deficit and regular exercise."
  },
  {
    id: "risk-5",
    type: "stroke",
    score: 30,
    maxScore: 100,
    level: "low",
    lastUpdated: "2025-04-15",
    recommendation: "Keep blood pressure controlled and avoid smoking."
  }
];

// Mock Patient Health Profile
export const mockPatientProfile: HealthProfile = {
  userId: "1",
  healthRisks: mockPatientHealthRisks,
  recentMeasurements: {
    bloodPressure: "135/85",
    glucoseLevel: 110,
    cholesterol: 195,
    bmi: 26.5,
    lastUpdated: "2025-04-15"
  },
  generalRecommendation: "Focus on reducing blood pressure through dietary changes and regular exercise. Schedule a follow-up appointment in 3 months.",
  assignedDoctor: {
    id: "doctor-1",
    name: "Dr. Emma Wilson",
    specialty: "Cardiology",
    rating: 4.8,
    availability: "Next available: Tomorrow, 2:00 PM"
  }
};

// Mock Doctors
export const mockDoctors: DoctorProfile[] = [
  {
    id: "doctor-1",
    name: "Dr. Emma Wilson",
    specialty: "Cardiology",
    rating: 4.8,
    availability: "Next available: Tomorrow, 2:00 PM",
    imageUrl: "/placeholder.svg",
    bio: "Specializes in preventive cardiology with 15 years of experience."
  },
  {
    id: "doctor-2",
    name: "Dr. Michael Chen",
    specialty: "Endocrinology",
    rating: 4.9,
    availability: "Next available: Friday, 10:00 AM",
    imageUrl: "/placeholder.svg",
    bio: "Expert in diabetes management and metabolic disorders."
  },
  {
    id: "doctor-3",
    name: "Dr. Sarah Johnson",
    specialty: "Internal Medicine",
    rating: 4.7,
    availability: "Next available: Today, 4:30 PM",
    imageUrl: "/placeholder.svg",
    bio: "Focuses on comprehensive health evaluations and chronic disease management."
  }
];

// Mock Patient List for Doctor's View
export const mockPatientsList: PatientSummary[] = [
  {
    id: "patient-1",
    name: "John Doe",
    age: 42,
    highestRisk: {
      type: "hypertension",
      level: "high"
    },
    lastCheckup: "2025-04-15",
    hasNewResults: true
  },
  {
    id: "patient-2",
    name: "Jane Smith",
    age: 35,
    highestRisk: {
      type: "diabetes",
      level: "moderate"
    },
    lastCheckup: "2025-04-10",
    hasNewResults: false
  },
  {
    id: "patient-3",
    name: "Robert Brown",
    age: 58,
    highestRisk: {
      type: "heartDisease",
      level: "high"
    },
    lastCheckup: "2025-04-05",
    hasNewResults: true
  },
  {
    id: "patient-4",
    name: "Maria Garcia",
    age: 29,
    highestRisk: {
      type: "obesity",
      level: "moderate"
    },
    lastCheckup: "2025-04-12",
    hasNewResults: false
  }
];

// Mock Past Predictions
export const mockPastPredictions: PastPrediction[] = [
  {
    id: "pred-1",
    date: "2025-04-15",
    healthRisks: [
      { type: "diabetes", score: 35, level: "moderate" },
      { type: "heartDisease", score: 22, level: "low" },
      { type: "hypertension", score: 68, level: "high" }
    ],
    doctorNote: "Patient should follow up in 3 months and maintain blood pressure medication."
  },
  {
    id: "pred-2",
    date: "2025-03-01",
    healthRisks: [
      { type: "diabetes", score: 40, level: "moderate" },
      { type: "heartDisease", score: 25, level: "low" },
      { type: "hypertension", score: 72, level: "high" }
    ],
    doctorNote: "Consider increasing physical activity and reducing sodium intake."
  },
  {
    id: "pred-3",
    date: "2025-01-20",
    healthRisks: [
      { type: "diabetes", score: 45, level: "moderate" },
      { type: "heartDisease", score: 30, level: "moderate" },
      { type: "hypertension", score: 75, level: "high" }
    ]
  }
];

// Form fields for health risk prediction
export interface HealthInputFormFields {
  age: number;
  gender: "male" | "female" | "other";
  height: number; // in cm
  weight: number; // in kg
  systolicBP: number;
  diastolicBP: number;
  glucoseLevel: number;
  cholesterolTotal: number;
  hdlCholesterol: number;
  ldlCholesterol: number;
  smokingStatus: "never" | "former" | "current";
  alcoholConsumption: "none" | "moderate" | "heavy";
  physicalActivity: "inactive" | "moderate" | "active";
  familyHistoryDiabetes: boolean;
  familyHistoryHeartDisease: boolean;
  familyHistoryHypertension: boolean;
  medicationHypertension: boolean;
  medicationCholesterol: boolean;
  medicationDiabetes: boolean;
}

// Default form values
export const defaultHealthInputs: HealthInputFormFields = {
  age: 40,
  gender: "male",
  height: 175,
  weight: 75,
  systolicBP: 120,
  diastolicBP: 80,
  glucoseLevel: 100,
  cholesterolTotal: 200,
  hdlCholesterol: 50,
  ldlCholesterol: 100,
  smokingStatus: "never",
  alcoholConsumption: "moderate",
  physicalActivity: "moderate",
  familyHistoryDiabetes: false,
  familyHistoryHeartDisease: false,
  familyHistoryHypertension: false,
  medicationHypertension: false,
  medicationCholesterol: false,
  medicationDiabetes: false
};

// Mock function to calculate risk based on inputs
export const calculateHealthRisks = (inputs: Partial<HealthInputFormFields>): HealthRisk[] => {
  // This is a simplified mock calculation
  // In a real app, this would use a more sophisticated algorithm or ML model
  
  const age = inputs.age || 40;
  const systolicBP = inputs.systolicBP || 120;
  const diastolicBP = inputs.diastolicBP || 80;
  const glucose = inputs.glucoseLevel || 100;
  const isSmoker = inputs.smokingStatus === "current";
  const hasFamily = inputs.familyHistoryHeartDisease || inputs.familyHistoryDiabetes || inputs.familyHistoryHypertension;
  
  // Calculate mock diabetes risk
  let diabetesScore = 20;
  if (glucose > 110) diabetesScore += 20;
  if (age > 45) diabetesScore += 10;
  if (inputs.familyHistoryDiabetes) diabetesScore += 15;
  
  // Calculate mock heart disease risk
  let heartScore = 15;
  if (systolicBP > 140) heartScore += 15;
  if (isSmoker) heartScore += 20;
  if (inputs.familyHistoryHeartDisease) heartScore += 15;
  if (age > 50) heartScore += 10;
  
  // Calculate mock hypertension risk
  let hypertensionScore = 15;
  if (systolicBP > 130) hypertensionScore += 20;
  if (diastolicBP > 85) hypertensionScore += 15;
  if (inputs.familyHistoryHypertension) hypertensionScore += 15;
  if (isSmoker) hypertensionScore += 10;
  
  // Calculate mock obesity risk
  let obesityScore = 20;
  if (inputs.weight && inputs.height) {
    const bmi = inputs.weight / Math.pow(inputs.height/100, 2);
    if (bmi > 25) obesityScore += 15;
    if (bmi > 30) obesityScore += 15;
  }
  
  // Calculate mock stroke risk
  let strokeScore = 10;
  if (systolicBP > 140) strokeScore += 20;
  if (age > 55) strokeScore += 15;
  if (isSmoker) strokeScore += 15;
  if (hasFamily) strokeScore += 10;
  
  return [
    {
      id: "risk-calc-1",
      type: "diabetes",
      score: Math.min(diabetesScore, 100),
      maxScore: 100,
      level: diabetesScore > 50 ? (diabetesScore > 70 ? "high" : "moderate") : "low",
      lastUpdated: new Date().toISOString().split('T')[0],
      recommendation: "Monitor blood glucose and maintain a healthy diet low in sugars."
    },
    {
      id: "risk-calc-2",
      type: "heartDisease",
      score: Math.min(heartScore, 100),
      maxScore: 100,
      level: heartScore > 50 ? (heartScore > 70 ? "high" : "moderate") : "low",
      lastUpdated: new Date().toISOString().split('T')[0],
      recommendation: "Consider regular cardiovascular check-ups and exercise."
    },
    {
      id: "risk-calc-3",
      type: "hypertension",
      score: Math.min(hypertensionScore, 100),
      maxScore: 100,
      level: hypertensionScore > 50 ? (hypertensionScore > 70 ? "high" : "moderate") : "low",
      lastUpdated: new Date().toISOString().split('T')[0],
      recommendation: "Monitor blood pressure regularly and reduce sodium intake."
    },
    {
      id: "risk-calc-4",
      type: "obesity",
      score: Math.min(obesityScore, 100),
      maxScore: 100,
      level: obesityScore > 50 ? (obesityScore > 70 ? "high" : "moderate") : "low",
      lastUpdated: new Date().toISOString().split('T')[0],
      recommendation: "Maintain a balanced diet and regular physical activity."
    },
    {
      id: "risk-calc-5",
      type: "stroke",
      score: Math.min(strokeScore, 100),
      maxScore: 100,
      level: strokeScore > 50 ? (strokeScore > 70 ? "high" : "moderate") : "low",
      lastUpdated: new Date().toISOString().split('T')[0],
      recommendation: "Control blood pressure and avoid smoking."
    }
  ];
};
