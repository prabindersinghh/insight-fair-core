import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ShieldCheck, Info, AlertCircle, HelpCircle } from "lucide-react";
import { BiasFactor } from "@/types/fairhire";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface BiasSignalsPanelProps {
  biasFactors: BiasFactor[];
  candidateName: string;
}

export function BiasSignalsPanel({ biasFactors, candidateName }: BiasSignalsPanelProps) {
  const hasBias = biasFactors.length > 0;

  const severityConfig = {
    low: { color: "caution" as const, icon: Info, label: "Low Confidence" },
    medium: { color: "caution" as const, icon: AlertCircle, label: "Medium Confidence" },
    high: { color: "bias" as const, icon: AlertTriangle, label: "High Confidence" },
  };

  const getBiasTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      name_proxy: "Name-Based Proxy Correlation",
      accent_penalty: "Accent Pattern Bias",
      language_fluency: "Language Fluency Assessment",
      appearance_bias: "Appearance-Related Factors",
      background_environment: "Interview Environment Bias",
      gender_language: "Gender-Coded Language",
      institution_bias: "Educational Institution Bias",
      age_proxy: "Age Proxy Indicators",
    };
    return labels[type] || type;
  };

  return (
    <Card variant="elevated" className={hasBias ? "border-bias/30" : "border-fair/30"}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${hasBias ? "bg-bias/10" : "bg-fair/10"}`}>
              {hasBias ? (
                <AlertTriangle className="h-4 w-4 text-bias" />
              ) : (
                <ShieldCheck className="h-4 w-4 text-fair" />
              )}
            </div>
            <div>
              <p className={`text-xs font-medium uppercase tracking-wider ${hasBias ? "text-bias" : "text-fair"}`}>
                Step 3: Bias Detection
              </p>
              <CardTitle className="text-lg">Bias Signals Analysis</CardTitle>
            </div>
          </div>
          <Badge variant={hasBias ? "bias" : "fair"} className="text-xs">
            {biasFactors.length} signal{biasFactors.length !== 1 ? "s" : ""} detected
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasBias ? (
          <div className="p-4 rounded-lg bg-fair/10 border border-fair/20 text-center">
            <ShieldCheck className="h-8 w-8 text-fair mx-auto mb-2" />
            <p className="text-sm font-medium text-fair">No Significant Bias Detected</p>
            <p className="text-xs text-muted-foreground mt-1">
              Evaluation for {candidateName} appears fair across all analyzed dimensions.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {biasFactors.map((factor, idx) => {
              const config = severityConfig[factor.severity];
              const Icon = config.icon;

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border ${
                    factor.severity === "high"
                      ? "bg-bias/5 border-bias/30"
                      : "bg-caution/5 border-caution/30"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Icon
                      className={`h-5 w-5 mt-0.5 shrink-0 ${
                        factor.severity === "high" ? "text-bias" : "text-caution"
                      }`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm">
                          {getBiasTypeLabel(factor.type)}
                        </h4>
                        <Badge variant={config.color} className="text-xs">
                          {config.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {factor.explanation}
                      </p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-muted-foreground">Impact:</span>
                        <Badge variant="muted">
                          {factor.contribution > 0 ? "+" : ""}
                          {factor.contribution.toFixed(1)} points
                        </Badge>
                      </div>
                      {factor.jdContext && (
                        <p className="text-xs text-muted-foreground mt-2 italic">
                          JD Context: {factor.jdContext}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Detection Layer Label */}
        <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-primary">Detection Layer:</span>
              <span className="text-xs text-foreground">Cross-Modal + Inclusion-Aware Reasoning Engine</span>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-xs">
                  <p className="text-xs">
                    This layer identifies behavioral and communication patterns that commonly lead to unfair penalties for neurodivergent, disabled, or rural candidates.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground italic">
            Bias signals are detected by analyzing patterns in resume language, name proxies,
            and interview modalities that may unfairly influence traditional scoring.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
