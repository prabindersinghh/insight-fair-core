import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, FileText, Video, Mic, ChevronRight, AlertTriangle, CheckCircle, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface CandidateCardProps {
  id: string;
  name: string;
  position: string;
  originalScore: number;
  adjustedScore: number;
  biasLevel: "low" | "medium" | "high";
  modalities: ("resume" | "video" | "audio")[];
  status: "processed" | "review" | "pending";
  onViewDetails: () => void;
}

export function CandidateCard({
  id,
  name,
  position,
  originalScore,
  adjustedScore,
  biasLevel,
  modalities,
  status,
  onViewDetails,
}: CandidateCardProps) {
  const improvement = adjustedScore - originalScore;

  const modalityIcons = {
    resume: FileText,
    video: Video,
    audio: Mic,
  };

  const biasColors = {
    low: "fair",
    medium: "caution",
    high: "bias",
  } as const;

  const statusConfig = {
    processed: { icon: CheckCircle, color: "text-fair", label: "Processed" },
    review: { icon: AlertTriangle, color: "text-caution", label: "Needs Review" },
    pending: { icon: Eye, color: "text-muted-foreground", label: "Pending" },
  };

  const StatusIcon = statusConfig[status].icon;

  return (
    <Card variant="elevated" className="group hover:-translate-y-1 transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center">
              <User className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg">{name}</h3>
              <p className="text-sm text-muted-foreground">{position}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <StatusIcon className={cn("h-4 w-4", statusConfig[status].color)} />
            <span className={cn("text-xs font-medium", statusConfig[status].color)}>
              {statusConfig[status].label}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Scores */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Original</p>
            <p className="text-lg font-semibold text-muted-foreground/70">{originalScore}</p>
          </div>
          <div className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <Badge variant={biasColors[biasLevel]}>
              {improvement > 0 ? "+" : ""}{improvement.toFixed(1)}
            </Badge>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Adjusted</p>
            <p className="text-lg font-bold text-foreground">{adjustedScore}</p>
          </div>
        </div>

        {/* Modalities */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Analyzed:</span>
            {modalities.map((mod) => {
              const Icon = modalityIcons[mod];
              return (
                <div key={mod} className="p-1.5 rounded-md bg-muted" title={mod}>
                  <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              );
            })}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onViewDetails}
            className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
          >
            View Details
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
