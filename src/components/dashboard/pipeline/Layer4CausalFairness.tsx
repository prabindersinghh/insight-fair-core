import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Loader2, Scale, FlaskConical, ArrowRight, TrendingUp, TrendingDown, ChevronDown } from "lucide-react";
import { Candidate } from "@/types/fairhire";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface Layer4CausalFairnessProps {
  candidate: Candidate;
  isActive: boolean;
  isComplete: boolean;
  onComplete: () => void;
}

export function Layer4CausalFairness({ candidate, isActive, isComplete, onComplete }: Layer4CausalFairnessProps) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<"idle" | "counterfactual" | "weights" | "adjusting" | "complete">("idle");
  const [isExpanded, setIsExpanded] = useState(true);
  
  const adjustment = candidate.adjustedScore - candidate.originalScore;
  const hasAdjustment = Math.abs(adjustment) > 0.1;
  const biasContributions = candidate.biasFactors.map(bf => ({
    type: bf.type,
    weight: bf.contribution
  }));

  useEffect(() => {
    if (isActive && !isComplete) {
      setStage("counterfactual");
      setProgress(0);

      const timer1 = setTimeout(() => {
        setProgress(35);
        setStage("weights");
      }, 400);

      const timer2 = setTimeout(() => {
        setProgress(70);
        setStage("adjusting");
      }, 700);

      const timer3 = setTimeout(() => {
        setProgress(100);
        setStage("complete");
      }, 1000);

      const timer4 = setTimeout(() => {
        onComplete();
      }, 1200);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
      };
    } else if (isComplete) {
      setProgress(100);
      setStage("complete");
    }
  }, [isActive, isComplete, onComplete]);

  const getStatusBadge = () => {
    if (isComplete || stage === "complete") {
      return hasAdjustment
        ? <Badge variant="fair" className="text-xs gap-1"><Scale className="h-3 w-3" /> Adjusted</Badge>
        : <Badge variant="muted" className="text-xs gap-1"><CheckCircle className="h-3 w-3" /> No Change</Badge>;
    }
    if (isActive) {
      return <Badge variant="caution" className="text-xs gap-1"><Loader2 className="h-3 w-3 animate-spin" /> Simulating</Badge>;
    }
    return <Badge variant="muted" className="text-xs">Pending</Badge>;
  };

  const getBiasLabel = (type: string) => {
    const labels: Record<string, string> = {
      name_proxy: "Name Proxy",
      accent_penalty: "Accent Pattern",
      language_fluency: "Language",
      appearance_bias: "Appearance",
      background_environment: "Environment",
      gender_language: "Gender Language",
      institution_bias: "Institution",
      age_proxy: "Age",
    };
    return labels[type] || type;
  };

  return (
    <Card variant="elevated" className={`transition-all duration-300 ${isComplete ? "border-primary/40" : isActive ? "border-primary/40 ring-2 ring-primary/20" : "border-border opacity-60"}`}>
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CardHeader className="pb-3">
          <CollapsibleTrigger className="w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isComplete ? "bg-primary text-primary-foreground" : isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  4
                </div>
                <div className="text-left">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Layer 4
                  </p>
                  <CardTitle className="text-base">Causal Fairness & Counterfactual Reasoning</CardTitle>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge()}
                <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
              </div>
            </div>
          </CollapsibleTrigger>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="space-y-4">
            {/* Progress indicator during processing */}
            {isActive && !isComplete && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    {stage === "counterfactual" && "Running counterfactual simulation..."}
                    {stage === "weights" && "Computing bias contribution weights..."}
                    {stage === "adjusting" && "Calculating fairness adjustment..."}
                  </span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {/* Score transformation visualization */}
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Original ATS Score</p>
                  <p className="text-2xl font-bold text-muted-foreground">{candidate.originalScore}</p>
                </div>
                <div className="flex flex-col items-center px-4">
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  {(stage === "complete" || isComplete) && hasAdjustment && (
                    <Badge variant={adjustment > 0 ? "fair" : "bias"} className="mt-1 text-xs">
                      {adjustment > 0 ? "+" : ""}{adjustment.toFixed(1)}
                    </Badge>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Fair Score</p>
                  <p className={`text-2xl font-bold ${(stage === "complete" || isComplete) ? "text-primary" : "text-muted-foreground/50"}`}>
                    {(stage === "complete" || isComplete) ? candidate.adjustedScore : "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* Counterfactual reasoning */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Counterfactual Simulation</p>
              
              <div className={`p-3 rounded-lg border ${stage !== "idle" ? "bg-primary/5 border-primary/20" : "bg-muted/20 border-border/50"}`}>
                <div className="flex items-center gap-3">
                  <FlaskConical className={`h-5 w-5 ${stage !== "idle" ? "text-primary" : "text-muted-foreground"}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Bias-Neutral Condition Test</p>
                    <p className="text-xs text-muted-foreground">
                      Simulating score under bias-neutral conditions
                    </p>
                  </div>
                  {(stage === "weights" || stage === "adjusting" || stage === "complete") && (
                    <Badge variant="fair" className="text-xs">Applied</Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Bias contribution weights */}
            {(isComplete || stage === "complete") && biasContributions.length > 0 && (
              <div className="space-y-2 animate-fade-in">
                <p className="text-xs font-medium text-muted-foreground">Bias Contribution Weights</p>
                <div className="space-y-2">
                  {biasContributions.slice(0, 4).map((contrib, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded bg-muted/30">
                      <span className="text-sm">{getBiasLabel(contrib.type)}</span>
                      <div className="flex items-center gap-2">
                        {contrib.weight > 0 ? (
                          <TrendingUp className="h-3 w-3 text-fair" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-bias" />
                        )}
                        <Badge variant={contrib.weight > 0 ? "fair" : "bias"} className="text-xs">
                          {contrib.weight > 0 ? "+" : ""}{contrib.weight.toFixed(1)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Explanation */}
            {(isComplete || stage === "complete") && (
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 animate-fade-in">
                <div className="flex items-start gap-2">
                  <Scale className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-primary">Causal Analysis</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {hasAdjustment
                        ? "We simulate score behavior under bias-neutral conditions. The adjustment reflects the estimated impact of detected bias patterns."
                        : "No counterfactual adjustment needed. Original score appears causally fair."}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Status message */}
            <p className="text-xs text-muted-foreground italic border-t border-border pt-3">
              {isComplete
                ? hasAdjustment
                  ? `✓ Counterfactual adjustment of ${adjustment > 0 ? "+" : ""}${adjustment.toFixed(1)} applied.`
                  : "✓ No adjustment needed. Score meets fairness criteria."
                : "Simulating counterfactual scenarios for fairness evaluation..."}
            </p>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
