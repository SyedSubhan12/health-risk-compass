import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface HealthRecommendationsProps {
  prediction: number;
  modelType: 'diabetes' | 'stroke' | 'heart';
}

const ANIMATION_STAGGER_DELAY = 0.05;
const MAX_RECOMMENDATIONS = 5;

export function HealthRecommendations({ prediction, modelType }: HealthRecommendationsProps) {
  const recommendations = useMemo(() => {
    const baseRecommendations = {
      diet: [
        'Increase intake of whole grains and fiber',
        'Limit processed foods and added sugars',
        'Include plenty of fruits and vegetables',
        'Choose lean protein sources',
        'Stay hydrated with water'
      ].slice(0, MAX_RECOMMENDATIONS),
      exercise: [
        'Aim for 150 minutes of moderate exercise weekly',
        'Include strength training 2-3 times per week',
        'Take regular breaks from sitting',
        'Find activities you enjoy to stay consistent',
        'Start slow and gradually increase intensity'
      ].slice(0, MAX_RECOMMENDATIONS)
    };

    const specificRecommendations = {
      diabetes: {
        diet: [
          'Monitor carbohydrate intake',
          'Choose low glycemic index foods',
          'Include healthy fats like avocados and nuts',
          'Limit sugary beverages',
          'Eat regular, balanced meals'
        ].slice(0, MAX_RECOMMENDATIONS),
        exercise: [
          'Focus on aerobic activities like walking or swimming',
          'Include resistance training to improve insulin sensitivity',
          'Monitor blood sugar before and after exercise',
          'Stay active throughout the day',
          'Consider working with a diabetes exercise specialist'
        ].slice(0, MAX_RECOMMENDATIONS)
      },
      stroke: {
        diet: [
          'Follow a heart-healthy diet',
          'Limit sodium intake',
          'Include foods rich in omega-3 fatty acids',
          'Choose low-fat dairy products',
          'Limit alcohol consumption'
        ].slice(0, MAX_RECOMMENDATIONS),
        exercise: [
          'Start with gentle activities like walking',
          'Include balance exercises',
          'Work on coordination and motor skills',
          'Consider physical therapy if needed',
          'Gradually increase activity level'
        ].slice(0, MAX_RECOMMENDATIONS)
      },
      heart: {
        diet: [
          'Follow a Mediterranean-style diet',
          'Include heart-healthy fats',
          'Limit saturated and trans fats',
          'Choose whole foods over processed',
          'Include foods rich in antioxidants'
        ].slice(0, MAX_RECOMMENDATIONS),
        exercise: [
          'Start with low-impact cardio',
          'Include interval training',
          'Monitor heart rate during exercise',
          'Stay within recommended intensity levels',
          'Include flexibility exercises'
        ].slice(0, MAX_RECOMMENDATIONS)
      }
    };

    return {
      diet: [...new Set([...baseRecommendations.diet, ...specificRecommendations[modelType].diet])].slice(0, MAX_RECOMMENDATIONS),
      exercise: [...new Set([...baseRecommendations.exercise, ...specificRecommendations[modelType].exercise])].slice(0, MAX_RECOMMENDATIONS)
    };
  }, [modelType]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: ANIMATION_STAGGER_DELAY
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full shadow-lg border-health-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-health-secondary">
            Personalized Health Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              variants={listVariants}
              initial="hidden"
              animate="visible"
            >
              <h3 className="text-xl font-semibold mb-4 text-health-primary">Diet Recommendations</h3>
              <ul className="space-y-3">
                {recommendations.diet.map((item, index) => (
                  <motion.li
                    key={index}
                    variants={itemVariants}
                    className="flex items-start gap-2"
                  >
                    <span className="text-health-primary">•</span>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              variants={listVariants}
              initial="hidden"
              animate="visible"
            >
              <h3 className="text-xl font-semibold mb-4 text-health-primary">Exercise Recommendations</h3>
              <ul className="space-y-3">
                {recommendations.exercise.map((item, index) => (
                  <motion.li
                    key={index}
                    variants={itemVariants}
                    className="flex items-start gap-2"
                  >
                    <span className="text-health-primary">•</span>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          {prediction === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <p className="text-red-800 font-medium">
                Based on your assessment, we recommend consulting with a healthcare professional for a comprehensive evaluation and personalized care plan.
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
} 