import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, ArrowRight, Scale, Sparkles } from "lucide-react";

interface ScoreEvolutionPanelProps {
  originalScore: number;
  adjustedScore: number;
  jdMatchScore?: number;
  biasFactorsCount: number;
}

export function ScoreEvolutionPanel({
  originalScore,
  adjustedScore,
  jdMatchScore,
  biasFactorsCount,
}: ScoreEvolutionPanelProps) {
  const adjustment = adjustedScore - originalScore;
  const isPositive = adjustment > 0;
  const hasAdjustment = adjustment !== 0;

  return (
    <Card variant="elevated" className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Scale className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-xs font-medium text-primary uppercase tracking-wider">
              Step 4: Score Evolution
            </p>
            <CardTitle className="text-lg">Final Fair Assessment</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score Evolution Visual */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border">
          {/* Original Score */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Original ATS Score</p>
            <p className="text-3xl font-bold text-muted-foreground/70">{originalScore}</p>
            <p className="text-xs text-muted-foreground mt-1">JD-based scoring</p>
          </div>

          {/* Arrow & Adjustment */}
          <div className="flex flex-col items-center px-4">
            <div className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
              <Badge
                variant={isPositive ? "fair" : adjustment < 0 ? "bias" : "muted"}
                className="text-sm font-semibold"
              >
                {isPositive ? "+" : ""}
                {adjustment.toFixed(1)}
              </Badge>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Fairness Adjustment
            </p>
          </div>

          {/* Final Score */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Final Fair Score</p>
            <div className="flex items-center gap-2 justify-center">
              <p className="text-3xl font-bold text-primary">{adjustedScore}</p>
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Bias-corrected</p>
          </div>
        </div>

        {/* Breakdown */}
        <div className="grid grid-cols-3 gap-3">
          {jdMatchScore !== undefined && (
            <div className="p-3 rounded-lg bg-muted/30 text-center">
              <p className="text-xs text-muted-foreground">JD Match</p>
              <p className="text-lg font-semibold">{jdMatchScore}%</p>
            </div>
          )}
          <div className="p-3 rounded-lg bg-muted/30 text-center">
            <p className="text-xs text-muted-foreground">Bias Signals</p>
            <p className="text-lg font-semibold">{biasFactorsCount}</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/30 text-center">
            <p className="text-xs text-muted-foreground">Score Change</p>
            <p className={`text-lg font-semibold ${isPositive ? "text-fair" : "text-muted-foreground"}`}>
              {isPositive ? "+" : ""}{adjustment.toFixed(1)}
            </p>
          </div>
        </div>

        {/* Explanation */}
        <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-start gap-2">
            <TrendingUp className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-primary">Score Adjustment Rationale</p>
              <p className="text-xs text-muted-foreground mt-1">
                {hasAdjustment ? (
                  <>
                    Score adjusted {isPositive ? "upward" : "downward"} by{" "}
                    <strong>{Math.abs(adjustment).toFixed(1)} points</strong> because{" "}
                    {biasFactorsCount > 0
                      ? `${biasFactorsCount} bias signal${biasFactorsCount > 1 ? "s were" : " was"} detected where confidence exceeded fairness threshold.`
                      : "minor calibration was applied for cross-modal consistency."}
                  </>
                ) : (
                  "No adjustment needed. Original ATS score appears fair across all dimensions."
                )}
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground italic text-center">
          This score represents a bias-corrected assessment, not a final hiring decision.
        </p>
      </CardContent>
    </Card>
  );
}
