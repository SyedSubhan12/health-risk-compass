import React, { useState } from 'react';
import { PredictionService, PredictionInput } from '@/services/predictionService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { HealthRecommendations } from './HealthRecommendations';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface FormErrors {
  age?: string;
  gender?: string;
}

const MIN_AGE = 18;
const MAX_AGE = 100;

export function PredictionForm() {
  const [formData, setFormData] = useState<PredictionInput>({
    age: 0,
    gender: '',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [prediction, setPrediction] = useState<number | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [modelType, setModelType] = useState<'diabetes' | 'stroke' | 'heart'>('diabetes');
  const [retryCount, setRetryCount] = useState(0);

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.age) {
      errors.age = 'Age is required';
    } else if (formData.age < MIN_AGE || formData.age > MAX_AGE) {
      errors.age = `Age must be between ${MIN_AGE} and ${MAX_AGE}`;
    }

    if (!formData.gender) {
      errors.gender = 'Gender is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const result = await PredictionService.makePrediction(
        modelType,
        'nn',
        formData
      );

      if (result.success) {
        setPrediction(result.prediction);
        setConfidence(result.confidence);
        setRetryCount(0);
      } else {
        throw new Error(result.error || 'Prediction failed');
      }
    } catch (err) {
      setError(err.message);
      if (retryCount < 2) {
        setRetryCount(prev => prev + 1);
        setTimeout(() => handleSubmit(e), 1000 * (retryCount + 1));
      }
    } finally {
      setLoading(false);
    }
  };

  const getPredictionLabel = (prediction: number) => {
    const labels = {
      diabetes: prediction === 1 ? 'At Risk of Diabetes' : 'Low Risk of Diabetes',
      stroke: prediction === 1 ? 'At Risk of Stroke' : 'Low Risk of Stroke',
      heart: prediction === 1 ? 'At Risk of Heart Disease' : 'Low Risk of Heart Disease'
    };
    return labels[modelType];
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full shadow-lg border-health-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-health-secondary">
              Health Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="modelType">Select Health Condition</Label>
                  <Select
                    value={modelType}
                    onValueChange={(value) => setModelType(value as 'diabetes' | 'stroke' | 'heart')}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="diabetes">Diabetes</SelectItem>
                      <SelectItem value="stroke">Stroke</SelectItem>
                      <SelectItem value="heart">Heart Disease</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    min={MIN_AGE}
                    max={MAX_AGE}
                    value={formData.age || ''}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      setFormData({ ...formData, age: isNaN(value) ? 0 : value });
                      setFormErrors(prev => ({ ...prev, age: undefined }));
                    }}
                    className={formErrors.age ? "border-red-500" : ""}
                    required
                  />
                  {formErrors.age && (
                    <p className="text-sm text-red-500">{formErrors.age}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => {
                      setFormData({ ...formData, gender: value });
                      setFormErrors(prev => ({ ...prev, gender: undefined }));
                    }}
                  >
                    <SelectTrigger className={`w-full ${formErrors.gender ? "border-red-500" : ""}`}>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.gender && (
                    <p className="text-sm text-red-500">{formErrors.gender}</p>
                  )}
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Alert variant="destructive" className="mt-4">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button 
                type="submit" 
                className="w-full bg-health-primary hover:bg-health-primary/90 text-white"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Analyzing...
                  </span>
                ) : (
                  'Get Risk Assessment'
                )}
              </Button>
            </form>

            <AnimatePresence>
              {prediction !== null && confidence !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="mt-6 space-y-4"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <Badge 
                      variant={prediction === 1 ? "destructive" : "default"}
                      className="text-lg px-4 py-2"
                    >
                      {getPredictionLabel(prediction)}
                    </Badge>
                    <div className="text-center text-muted-foreground">
                      <p>Confidence: {confidence.toFixed(2)}%</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      <AnimatePresence>
        {prediction !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.2 }}
          >
            <HealthRecommendations prediction={prediction} modelType={modelType} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 