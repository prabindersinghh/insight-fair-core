import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FileText, Video, Mic, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalityData {
  modality: "resume" | "video" | "audio";
  confidenceScore: number;
  biasDetected: boolean;
  factors: { name: string; severity: "low" | "medium" | "high" }[];
}

interface ModalityBreakdownProps {
  data: ModalityData[];
}

const modalityConfig = {
  resume: { icon: FileText, label: "Resume Analysis", color: "text-primary" },
  video: { icon: Video, label: "Video Interview", color: "text-fair" },
  audio: { icon: Mic, label: "Speech Analysis", color: "text-accent" },
};

export function ModalityBreakdown({ data }: ModalityBreakdownProps) {
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Modality-wise Analysis</CardTitle>
        <CardDescription>
          Breakdown of bias detection confidence and factors per input modality
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {data.map((item) => {
          const config = modalityConfig[item.modality];
          const Icon = config.icon;
          
          return (
            <div key={item.modality} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-lg bg-muted", config.color)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-medium">{config.label}</h4>
                    <p className="text-xs text-muted-foreground">
                      {item.factors.length} factors analyzed
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {item.biasDetected ? (
                    <Badge variant="caution" className="gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Bias Detected
                    </Badge>
                  ) : (
                    <Badge variant="fair" className="gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Fair
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Confidence</span>
                  <span className="font-medium">{item.confidenceScore}%</span>
                </div>
                <Progress value={item.confidenceScore} className="h-2" />
              </div>

              {item.factors.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {item.factors.map((factor, idx) => (
                    <Badge 
                      key={idx} 
                      variant={factor.severity === "high" ? "bias" : factor.severity === "medium" ? "caution" : "muted"}
                      className="text-xs"
                    >
                      {factor.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
