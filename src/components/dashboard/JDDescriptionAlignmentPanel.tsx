import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FileText, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import type { Candidate } from "@/types/fairhire";

interface JDDescriptionAlignmentPanelProps {
  candidate: Candidate;
}

export function JDDescriptionAlignmentPanel({ candidate }: JDDescriptionAlignmentPanelProps) {
  const alignment = candidate.jdDescriptionAlignment;
  
  if (!alignment) {
    return null;
  }

  const getMatchIcon = (match: "low" | "medium" | "high") => {
    switch (match) {
      case "high": return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "medium": return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "low": return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getMatchBadgeVariant = (match: "low" | "medium" | "high") => {
    switch (match) {
      case "high": return "fair" as const;
      case "medium": return "caution" as const;
      case "low": return "destructive" as const;
    }
  };

  const getProgressColor = (percent: number) => {
    if (percent >= 75) return "bg-green-500";
    if (percent >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Card variant="elevated">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          Job Description Alignment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Skill Overlap Percentage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Skill Overlap</span>
            <span className="font-medium">{alignment.skillOverlapPercent}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${getProgressColor(alignment.skillOverlapPercent)}`}
              style={{ width: `${alignment.skillOverlapPercent}%` }}
            />
          </div>
        </div>

        {/* Responsibilities Match */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Responsibilities Match</span>
          <Badge variant={getMatchBadgeVariant(alignment.responsibilitiesMatch)} className="flex items-center gap-1">
            {getMatchIcon(alignment.responsibilitiesMatch)}
            {alignment.responsibilitiesMatch.charAt(0).toUpperCase() + alignment.responsibilitiesMatch.slice(1)}
          </Badge>
        </div>

        {/* Missing Areas */}
        {alignment.missingAreas.length > 0 && (
          <div className="space-y-2">
            <span className="text-sm text-muted-foreground">Missing Areas</span>
            <div className="flex flex-wrap gap-1.5">
              {alignment.missingAreas.map((area, idx) => (
                <Badge key={idx} variant="outline" className="text-xs text-muted-foreground">
                  {area}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Alignment Summary */}
        <div className="pt-3 border-t border-border">
          <p className="text-sm text-muted-foreground italic leading-relaxed">
            "{alignment.alignmentSummary}"
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
