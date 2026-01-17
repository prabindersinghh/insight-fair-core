import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Heart, Info, CheckCircle, Eye, MessageSquare, FileText, MapPin } from "lucide-react";
import type { InclusionAdjustment } from "@/types/fairhire";

interface InclusionAdjustmentsPanelProps {
  inclusionAdjustment: InclusionAdjustment;
  candidateName: string;
}

const signalIcons: Record<string, React.ElementType> = {
  speech_disfluency: MessageSquare,
  slow_speech_rate: MessageSquare,
  accent_deviation: MessageSquare,
  response_delay: MessageSquare,
  low_eye_contact: Eye,
  flat_affect: Eye,
  nervousness: Eye,
  grammar_irregularity: FileText,
  rural_background: MapPin,
};

const signalLabels: Record<string, string> = {
  speech_disfluency: "Speech Fluency",
  slow_speech_rate: "Speaking Pace",
  accent_deviation: "Accent Pattern",
  response_delay: "Response Timing",
  low_eye_contact: "Eye Contact",
  flat_affect: "Facial Expression",
  nervousness: "Nervousness Detection",
  grammar_irregularity: "Language Structure",
  rural_background: "Rural Background",
};

export function InclusionAdjustmentsPanel({ 
  inclusionAdjustment, 
  candidateName 
}: InclusionAdjustmentsPanelProps) {
  const detectedSignals = inclusionAdjustment.signals.filter(s => s.detected);
  
  if (detectedSignals.length === 0) {
    return null;
  }

  return (
    <Card variant="elevated" className="border-fair/20 bg-fair/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-fair/10">
              <Heart className="h-5 w-5 text-fair" />
            </div>
            <div>
              <CardTitle className="text-lg">Inclusion Bias Adjustments Applied</CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">
                Fairness corrections for {candidateName}
              </p>
            </div>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 cursor-help">
                  <Info className="h-4 w-4 text-muted-foreground" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>These adjustments remove unfair penalties unrelated to job skills. No medical diagnosis is made.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Adjustment Score */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-background border">
          <span className="text-sm font-medium">Total Inclusion Adjustment</span>
          <Badge variant="fair" className="text-base px-3 py-1">
            +{inclusionAdjustment.totalAdjustment} points
          </Badge>
        </div>

        {/* Detected Signals */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Signals Detected & Corrected</h4>
          <div className="grid gap-2">
            {detectedSignals.map((signal, index) => {
              const Icon = signalIcons[signal.type] || CheckCircle;
              const label = signalLabels[signal.type] || signal.type;
              
              return (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-background border animate-slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="p-1.5 rounded-md bg-fair/10">
                    <Icon className="h-4 w-4 text-fair" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{label}</span>
                      <Badge variant="muted" className="text-xs">
                        {signal.confidence}% confidence
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {signal.adaptation}
                    </p>
                  </div>
                  <CheckCircle className="h-4 w-4 text-fair shrink-0" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Explanation */}
        {inclusionAdjustment.explanationText && (
          <div className="p-3 rounded-lg bg-fair/10 border border-fair/20">
            <p className="text-sm text-foreground leading-relaxed">
              {inclusionAdjustment.explanationText}
            </p>
          </div>
        )}

        {/* Tagline */}
        <p className="text-xs text-center text-muted-foreground italic pt-2 border-t">
          "Built to include candidates with speech differences, mental health conditions, hearing limitations, and rural backgrounds."
        </p>
      </CardContent>
    </Card>
  );
}
