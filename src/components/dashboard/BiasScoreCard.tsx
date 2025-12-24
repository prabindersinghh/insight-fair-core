import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface BiasScoreCardProps {
  title: string;
  originalScore: number;
  adjustedScore: number;
  biasContribution: number;
  modality: "resume" | "video" | "audio" | "overall";
}

export function BiasScoreCard({ 
  title, 
  originalScore, 
  adjustedScore, 
  biasContribution,
  modality 
}: BiasScoreCardProps) {
  const improvement = adjustedScore - originalScore;
  const isPositive = improvement > 0;
  const isNeutral = Math.abs(improvement) < 0.5;

  const modalityColors = {
    resume: "text-primary bg-primary/10",
    video: "text-fair bg-fair/10",
    audio: "text-accent bg-accent/10",
    overall: "text-chart-4 bg-chart-4/10",
  };

  const getVariant = () => {
    if (Math.abs(biasContribution) < 5) return "fair";
    if (Math.abs(biasContribution) < 15) return "caution";
    return "bias";
  };

  return (
    <Card variant="elevated" className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">{title}</CardTitle>
          <Badge variant="muted" className={cn("text-xs capitalize", modalityColors[modality])}>
            {modality}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Score Comparison */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Original</p>
              <p className="text-2xl font-bold font-display text-muted-foreground/70 line-through">
                {originalScore.toFixed(1)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground mb-1">Adjusted</p>
              <p className="text-3xl font-bold font-display text-foreground">
                {adjustedScore.toFixed(1)}
              </p>
            </div>
          </div>

          {/* Change Indicator */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center gap-2">
              {isNeutral ? (
                <Minus className="h-4 w-4 text-muted-foreground" />
              ) : isPositive ? (
                <TrendingUp className="h-4 w-4 text-fair" />
              ) : (
                <TrendingDown className="h-4 w-4 text-bias" />
              )}
              <span className={cn(
                "text-sm font-medium",
                isNeutral ? "text-muted-foreground" : isPositive ? "text-fair" : "text-bias"
              )}>
                {isPositive ? "+" : ""}{improvement.toFixed(1)} pts
              </span>
            </div>
            <Badge variant={getVariant()} className="text-xs">
              Bias: {biasContribution > 0 ? "+" : ""}{biasContribution.toFixed(0)}%
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
