import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Loader2, ShieldAlert, AlertTriangle, Info, ShieldCheck, ChevronDown, FileSearch, Eye, Ear } from "lucide-react";
import { Candidate, BiasFactor } from "@/types/fairhire";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface Layer3BiasAnalysisProps {
  candidate: Candidate;
  isActive: boolean;
  isComplete: boolean;
  onComplete: () => void;
}

export function Layer3BiasAnalysis({ candidate, isActive, isComplete, onComplete }: Layer3BiasAnalysisProps) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<"idle" | "resume_interview" | "language" | "proxy" | "complete">("idle");
  const [isExpanded, setIsExpanded] = useState(true);
  const biasFactors = candidate.biasFactors;
  const hasBias = biasFactors.length > 0;
  const hasInterview = candidate.modalities.includes("video") || candidate.modalities.includes("audio");

  // Keep expanded when active
  useEffect(() => {
    if (isActive) setIsExpanded(true);
  }, [isActive]);

  useEffect(() => {
    if (isActive && !isComplete) {
      setStage("resume_interview");
      setProgress(0);

      // Slower, more visible animation
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev < 35) return prev + 2;
          if (prev < 70) return prev + 2;
          if (prev < 100) return prev + 3;
          return prev;
        });
      }, 80);

      const timer1 = setTimeout(() => {
        setStage("language");
      }, 1000);

      const timer2 = setTimeout(() => {
        setStage("proxy");
      }, 1800);

      const timer3 = setTimeout(() => {
        setProgress(100);
        setStage("complete");
      }, 2400);

      const timer4 = setTimeout(() => {
        onComplete();
      }, 3000);

      return () => {
        clearInterval(interval);
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
      return hasBias 
        ? <Badge variant="caution" className="text-xs gap-1"><AlertTriangle className="h-3 w-3" /> {biasFactors.length} Signals</Badge>
        : <Badge variant="fair" className="text-xs gap-1"><ShieldCheck className="h-3 w-3" /> No Bias</Badge>;
    }
    if (isActive) {
      return <Badge variant="caution" className="text-xs gap-1"><Loader2 className="h-3 w-3 animate-spin" /> Analyzing</Badge>;
    }
    return <Badge variant="muted" className="text-xs">Pending</Badge>;
  };

  const severityConfig = {
    low: { color: "caution" as const, icon: Info, label: "Low" },
    medium: { color: "caution" as const, icon: AlertTriangle, label: "Medium" },
    high: { color: "bias" as const, icon: ShieldAlert, label: "High" },
  };

  const getBiasTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      name_proxy: "Name-Based Proxy",
      accent_penalty: "Accent Pattern",
      language_fluency: "Language Assessment",
      appearance_bias: "Appearance Factors",
      background_environment: "Environment Bias",
      gender_language: "Gender-Coded Language",
      institution_bias: "Institution Bias",
      age_proxy: "Age Indicators",
    };
    return labels[type] || type;
  };

  return (
    <Card variant="elevated" className={`transition-all duration-500 ${isComplete ? (hasBias ? "border-caution/40" : "border-fair/40") : isActive ? "border-primary/40 ring-2 ring-primary/20 shadow-lg shadow-primary/10" : "border-border opacity-50"}`}>
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CardHeader className="pb-3">
          <CollapsibleTrigger className="w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isComplete ? (hasBias ? "bg-caution text-caution-foreground" : "bg-fair text-fair-foreground") : isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  3
                </div>
                <div className="text-left">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Layer 3
                  </p>
                  <CardTitle className="text-base">Cross-Modal Bias Consistency & Attribution</CardTitle>
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
                    {stage === "resume_interview" && "Checking score disparity..."}
                    {stage === "language" && "Analyzing language sensitivity..."}
                    {stage === "proxy" && "Detecting proxy correlations..."}
                  </span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {/* Consistency checks */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Consistency Checks</p>
              
              <div className={`p-3 rounded-lg border ${(stage !== "idle") ? "bg-muted/30 border-border" : "bg-muted/20 border-border/50"}`}>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <FileSearch className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs">↔</span>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Resume ↔ Interview Score Disparity</p>
                    <p className="text-xs text-muted-foreground">
                      {hasInterview 
                        ? "Cross-modal consistency verified"
                        : "Interview modality not provided — resume-only check applied"}
                    </p>
                  </div>
                  {(stage !== "idle" && stage !== "resume_interview") && (
                    <CheckCircle className="h-4 w-4 text-fair" />
                  )}
                </div>
              </div>

              <div className={`p-3 rounded-lg border ${(stage === "language" || stage === "proxy" || stage === "complete") ? "bg-muted/30 border-border" : "bg-muted/20 border-border/50"}`}>
                <div className="flex items-center gap-3">
                  <Ear className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Language Proficiency ↔ Rubric Sensitivity</p>
                    <p className="text-xs text-muted-foreground">Checking for accent/fluency penalties</p>
                  </div>
                  {(stage === "proxy" || stage === "complete") && (
                    <CheckCircle className="h-4 w-4 text-fair" />
                  )}
                </div>
              </div>

              <div className={`p-3 rounded-lg border ${stage === "complete" ? "bg-muted/30 border-border" : "bg-muted/20 border-border/50"}`}>
                <div className="flex items-center gap-3">
                  <ShieldAlert className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Name/Appearance Proxy Correlation</p>
                    <p className="text-xs text-muted-foreground">Detecting protected attribute proxies</p>
                  </div>
                  {stage === "complete" && (
                    <CheckCircle className="h-4 w-4 text-fair" />
                  )}
                </div>
              </div>
            </div>

            {/* Bias signals detected */}
            {(isComplete || stage === "complete") && (
              <div className="space-y-3 animate-fade-in">
                <p className="text-xs font-medium text-muted-foreground">Bias Signals Detected</p>
                
                {!hasBias ? (
                  <div className="p-4 rounded-lg bg-fair/10 border border-fair/20 text-center">
                    <ShieldCheck className="h-6 w-6 text-fair mx-auto mb-2" />
                    <p className="text-sm font-medium text-fair">No Significant Bias Detected</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Evaluation appears fair across all analyzed dimensions.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {biasFactors.slice(0, 3).map((factor, idx) => {
                      const config = severityConfig[factor.severity];
                      const Icon = config.icon;
                      return (
                        <div
                          key={idx}
                          className={`p-3 rounded-lg border ${factor.severity === "high" ? "bg-bias/5 border-bias/30" : "bg-caution/5 border-caution/30"}`}
                        >
                          <div className="flex items-start gap-2">
                            <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${factor.severity === "high" ? "text-bias" : "text-caution"}`} />
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium">{getBiasTypeLabel(factor.type)}</span>
                                <Badge variant={config.color} className="text-xs">{config.label}</Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">{factor.explanation}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {biasFactors.length > 3 && (
                      <p className="text-xs text-muted-foreground text-center">
                        +{biasFactors.length - 3} more bias signals detected
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Status message */}
            <p className="text-xs text-muted-foreground italic border-t border-border pt-3">
              {isComplete
                ? hasBias 
                  ? `✓ Analysis complete. ${biasFactors.length} bias signal(s) flagged for fairness adjustment.`
                  : "✓ Analysis complete. No bias signals requiring adjustment."
                : "Performing cross-modal bias consistency checks..."}
            </p>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
