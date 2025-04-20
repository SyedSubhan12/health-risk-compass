
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RiskIndicator } from "@/components/ui/risk-indicator";
import { cn } from "@/lib/utils";

type RiskLevel = "low" | "moderate" | "high";

interface HealthCardProps {
  title: string;
  description?: string;
  value: number;
  maxValue: number;
  riskLevel: RiskLevel;
  icon?: React.ReactNode;
  recommendation?: string;
  className?: string;
}

export function HealthCard({
  title,
  description,
  value,
  maxValue,
  riskLevel,
  icon,
  recommendation,
  className,
}: HealthCardProps) {
  // Calculate percentage for progress bar
  const percentage = (value / maxValue) * 100;
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="space-y-1">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">{title}</CardTitle>
          {icon && <div className="text-health-primary">{icon}</div>}
        </div>
        {description && (
          <CardDescription>{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <RiskIndicator level={riskLevel} score={value} />
            <span className="text-sm font-medium">{value}/{maxValue}</span>
          </div>
          <Progress value={percentage} className="h-2" />
        </div>
      </CardContent>
      {recommendation && (
        <CardFooter className="bg-accent bg-opacity-50 p-3 text-sm">
          <p>{recommendation}</p>
        </CardFooter>
      )}
    </Card>
  );
}
