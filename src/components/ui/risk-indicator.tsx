
import React from "react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type RiskLevel = "low" | "moderate" | "high";

interface RiskIndicatorProps {
  level: RiskLevel;
  score?: number;
  label?: string;
  showValue?: boolean;
  className?: string;
}

const getColorClass = (level: RiskLevel) => {
  switch (level) {
    case "low":
      return "bg-risk-low";
    case "moderate":
      return "bg-risk-moderate";
    case "high":
      return "bg-risk-high";
    default:
      return "bg-risk-low";
  }
};

const getRiskLabel = (level: RiskLevel) => {
  switch (level) {
    case "low":
      return "Low Risk";
    case "moderate":
      return "Moderate Risk";
    case "high":
      return "High Risk";
    default:
      return "Unknown";
  }
};

export function RiskIndicator({
  level,
  score,
  label,
  showValue = true,
  className,
}: RiskIndicatorProps) {
  const colorClass = getColorClass(level);
  const displayLabel = label || getRiskLabel(level);
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn("flex items-center space-x-2", className)}>
            <div className={cn("w-3 h-3 rounded-full", colorClass)}></div>
            <span className="text-sm font-medium">
              {displayLabel}
              {showValue && score !== undefined && `: ${score}`}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{displayLabel}</p>
          {score !== undefined && <p className="text-xs">Score: {score}</p>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
