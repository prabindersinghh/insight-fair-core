import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, RefreshCw, AlertTriangle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CounterfactualScenario {
  intervention: string;
  originalOutcome: number;
  counterfactualOutcome: number;
  biasDetected: boolean;
}

interface CounterfactualComparisonProps {
  scenarios: CounterfactualScenario[];
}

export function CounterfactualComparison({ scenarios }: CounterfactualComparisonProps) {
  return (
    <Card variant="elevated">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-chart-4/10">
            <RefreshCw className="h-5 w-5 text-chart-4" />
          </div>
          <div>
            <CardTitle>Counterfactual Analysis</CardTitle>
            <CardDescription>
              What-if scenarios showing outcome changes under identity interventions
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {scenarios.map((scenario, index) => {
          const difference = scenario.counterfactualOutcome - scenario.originalOutcome;
          const hasBias = Math.abs(difference) > 2;
          
          return (
            <div 
              key={index}
              className={cn(
                "p-4 rounded-lg border transition-colors",
                hasBias 
                  ? "border-caution/30 bg-caution-muted" 
                  : "border-fair/30 bg-fair-muted"
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <Badge variant={hasBias ? "caution" : "fair"} className="gap-1">
                  {hasBias ? (
                    <>
                      <AlertTriangle className="h-3 w-3" />
                      Bias Detected
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-3 w-3" />
                      Fair
                    </>
                  )}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Intervention #{index + 1}
                </span>
              </div>
              
              <p className="font-medium mb-4">{scenario.intervention}</p>
              
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Original</p>
                  <p className="text-xl font-bold font-display">
                    {scenario.originalOutcome.toFixed(1)}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 px-4">
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  <Badge 
                    variant={hasBias ? "bias" : "muted"}
                    className="font-mono"
                  >
                    {difference > 0 ? "+" : ""}{difference.toFixed(1)}
                  </Badge>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
                
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Counterfactual</p>
                  <p className="text-xl font-bold font-display">
                    {scenario.counterfactualOutcome.toFixed(1)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        
        <p className="text-xs text-muted-foreground text-center pt-2">
          * Scores that change significantly under intervention indicate potential bias
        </p>
      </CardContent>
    </Card>
  );
}
