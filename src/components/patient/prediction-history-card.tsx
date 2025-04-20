
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RiskIndicator } from "@/components/ui/risk-indicator";

interface HealthRisk {
  type: string;
  level: "low" | "moderate" | "high";
  score: number;
}

interface PredictionHistoryCardProps {
  id: string;
  date: string;
  healthRisks: HealthRisk[];
  doctorNote?: string;
  onViewDetails?: () => void;
}

export function PredictionHistoryCard({
  id,
  date,
  healthRisks,
  doctorNote,
  onViewDetails,
}: PredictionHistoryCardProps) {
  const formatRiskType = (type: string) => {
    switch (type) {
      case "heartDisease":
        return "Heart Disease";
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Assessment: {date}</CardTitle>
          <Button variant="outline" size="sm" onClick={onViewDetails}>
            View Details
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {healthRisks.map((risk, index) => (
            <div key={`${id}-${risk.type}-${index}`} className="flex items-center gap-2">
              <RiskIndicator level={risk.level} score={risk.score} label={formatRiskType(risk.type)} />
            </div>
          ))}
        </div>
        {doctorNote && (
          <div className="mt-3 p-3 bg-accent rounded-md">
            <p className="text-sm font-medium">Doctor's Note:</p>
            <p className="text-sm">{doctorNote}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
