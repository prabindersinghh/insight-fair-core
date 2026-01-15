import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Loader2, Sparkles, MessageSquare, AlertTriangle, ArrowRight, FileText, ChevronDown } from "lucide-react";
import { Candidate } from "@/types/fairhire";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface Layer5FinalScoreProps {
  candidate: Candidate;
  isActive: boolean;
  isComplete: boolean;
  onComplete: () => void;
}

export function Layer5FinalScore({ candidate, isActive, isComplete, onComplete }: Layer5FinalScoreProps) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<"idle" | "consolidating" | "scoring" | "explaining" | "reviewing" | "complete">("idle");
  const [isExpanded, setIsExpanded] = useState(true);
  const [currentMessage, setCurrentMessage] = useState("");
  
  const adjustment = candidate.adjustedScore - candidate.originalScore;
  const isPositive = adjustment > 0;
  const needsReview = candidate.status === "review";

  const processingMessages = [
    "Consolidating modality scores...",
    "Applying JD-conditioned weighting...",
    "Computing unified fairness score...",
    "Generating human-readable explanation...",
    "Running governance review check...",
    "Finalizing evaluation output..."
  ];

  // Keep expanded when active
  useEffect(() => {
    if (isActive) setIsExpanded(true);
  }, [isActive]);

  useEffect(() => {
    if (isActive && !isComplete) {
      setStage("consolidating");
      setProgress(0);
      setCurrentMessage(processingMessages[0]);

      let progressValue = 0;
      const interval = setInterval(() => {
        progressValue += Math.random() * 3 + 1.5;
        if (progressValue > 100) progressValue = 100;
        setProgress(Math.round(progressValue));
      }, 100);

      const timer0 = setTimeout(() => {
        setCurrentMessage(processingMessages[1]);
      }, 400);

      const timer1 = setTimeout(() => {
        setStage("scoring");
        setCurrentMessage(processingMessages[2]);
      }, 800);

      const timer2 = setTimeout(() => {
        setStage("explaining");
        setCurrentMessage(processingMessages[3]);
      }, 1400);

      const timer3 = setTimeout(() => {
        setStage("reviewing");
        setCurrentMessage(processingMessages[4]);
      }, 2000);

      const timer4 = setTimeout(() => {
        setProgress(100);
        setStage("complete");
        setCurrentMessage(processingMessages[5]);
      }, 2600);

      const timer5 = setTimeout(() => {
        onComplete();
      }, 3200);

      return () => {
        clearInterval(interval);
        clearTimeout(timer0);
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
        clearTimeout(timer5);
      };
    } else if (isComplete) {
      setProgress(100);
      setStage("complete");
    }
  }, [isActive, isComplete, onComplete]);

  const getStatusBadge = () => {
    if (isComplete || stage === "complete") {
      return needsReview
        ? <Badge variant="caution" className="text-xs gap-1"><AlertTriangle className="h-3 w-3" /> Needs Review</Badge>
        : <Badge variant="fair" className="text-xs gap-1"><CheckCircle className="h-3 w-3" /> Processed</Badge>;
    }
    if (isActive) {
      return <Badge variant="caution" className="text-xs gap-1"><Loader2 className="h-3 w-3 animate-spin" /> Finalizing</Badge>;
    }
    return <Badge variant="muted" className="text-xs">Pending</Badge>;
  };

  return (
    <Card variant="elevated" className={`transition-all duration-500 ${isComplete ? "border-primary/50 bg-gradient-to-br from-primary/5 to-transparent" : isActive ? "border-primary/40 ring-2 ring-primary/20 shadow-lg shadow-primary/10" : "border-border opacity-50"}`}>
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CardHeader className="pb-3">
          <CollapsibleTrigger className="w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isComplete ? "bg-primary text-primary-foreground" : isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  5
                </div>
                <div className="text-left">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Layer 5
                  </p>
                  <CardTitle className="text-base">Unified Fairness Score & Explainability Agent</CardTitle>
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
              <div className="space-y-3">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    {currentMessage}
                  </span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {/* Final score display */}
            {(isComplete || stage === "complete") && (
              <div className="space-y-4 animate-fade-in">
                {/* Score card */}
                <div className="p-6 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30 text-center">
                  <p className="text-xs text-muted-foreground mb-2">Final Fairness-Adjusted Score</p>
                  <div className="flex items-center justify-center gap-3">
                    <p className="text-5xl font-bold text-primary">{candidate.adjustedScore}</p>
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-3">
                    <span className="text-sm text-muted-foreground">Original: {candidate.originalScore}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <Badge variant={isPositive ? "fair" : adjustment < 0 ? "bias" : "muted"} className="text-xs">
                      {isPositive ? "+" : ""}{adjustment.toFixed(1)} adjustment
                    </Badge>
                  </div>
                </div>

                {/* Recommendation */}
                <div className={`p-4 rounded-lg border ${needsReview ? "bg-caution/10 border-caution/30" : "bg-fair/10 border-fair/30"}`}>
                  <div className="flex items-start gap-3">
                    {needsReview ? (
                      <AlertTriangle className="h-5 w-5 text-caution shrink-0" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-fair shrink-0" />
                    )}
                    <div>
                      <p className={`font-semibold ${needsReview ? "text-caution" : "text-fair"}`}>
                        {needsReview ? "Needs Human Review" : "Processed Successfully"}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {needsReview
                          ? "Detected bias patterns may require additional context from a human reviewer before proceeding."
                          : "Candidate evaluation completed with fairness adjustments applied."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Human-readable explanation */}
                <div className="p-4 rounded-lg bg-muted/30 border border-border">
                  <div className="flex items-start gap-3">
                    <MessageSquare className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Explanation</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {candidate.fairnessSummary}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Key insights */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-muted/30 text-center">
                    <p className="text-xs text-muted-foreground">JD Match</p>
                    <p className="text-lg font-semibold">{candidate.jdMatchResult?.overallScore ?? "—"}%</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30 text-center">
                    <p className="text-xs text-muted-foreground">Bias Signals</p>
                    <p className="text-lg font-semibold">{candidate.biasFactors.length}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30 text-center">
                    <p className="text-xs text-muted-foreground">Modalities</p>
                    <p className="text-lg font-semibold">{candidate.modalities.length}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Status message */}
            <p className="text-xs text-muted-foreground italic border-t border-border pt-3">
              {isComplete
                ? "✓ Evaluation pipeline complete. This score represents a bias-corrected assessment, not a final hiring decision."
                : "Generating final fairness score and human-readable explanation..."}
            </p>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
