import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Video, Mic, FileText, AlertTriangle, CheckCircle, 
  Eye, Volume2, Languages, Activity 
} from "lucide-react";
import type { Candidate } from "@/types/fairhire";

interface InterviewInsightsPanelProps {
  candidate: Candidate;
}

export function InterviewInsightsPanel({ candidate }: InterviewInsightsPanelProps) {
  const hasVideo = candidate.modalities.includes("video");
  const hasAudio = candidate.modalities.includes("audio");
  const hasResume = candidate.modalities.includes("resume");
  const crossModal = candidate.crossModalConsistency;

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "text": return <FileText className="h-4 w-4" />;
      case "audio": return <Volume2 className="h-4 w-4" />;
      case "video": return <Eye className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getSourceLabel = (source: string) => {
    switch (source) {
      case "text": return "Resume Text";
      case "audio": return "Audio Interview";
      case "video": return "Video Interview";
      case "multiple": return "Multiple Sources";
      default: return source;
    }
  };

  return (
    <Card variant="elevated" className="border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Video className="h-4 w-4 text-primary" />
            Interview & Cross-Modal Insights
          </CardTitle>
          <div className="flex gap-1">
            {hasResume && <Badge variant="secondary" className="text-xs gap-1"><FileText className="h-3 w-3" /> Resume</Badge>}
            {hasVideo && <Badge variant="secondary" className="text-xs gap-1"><Video className="h-3 w-3" /> Video</Badge>}
            {hasAudio && <Badge variant="secondary" className="text-xs gap-1"><Mic className="h-3 w-3" /> Audio</Badge>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Interview Video Info */}
        {candidate.interviewVideo && (
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-2">
              <Video className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">Interview Video</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <span>File: {candidate.interviewVideo.fileName}</span>
              <span>Size: {(candidate.interviewVideo.fileSize / (1024 * 1024)).toFixed(2)} MB</span>
              {candidate.interviewVideo.duration && (
                <span>Duration: {Math.floor(candidate.interviewVideo.duration / 60)}:{String(candidate.interviewVideo.duration % 60).padStart(2, '0')}</span>
              )}
              <span>Format: {candidate.interviewVideo.format}</span>
            </div>
          </div>
        )}

        {/* No interview modality message */}
        {!hasVideo && !hasAudio && (
          <div className="p-3 rounded-lg bg-caution-muted border border-caution/30">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-caution-foreground" />
              <span className="text-sm text-caution-foreground">
                Interview modality not provided — resume-only consistency check applied.
              </span>
            </div>
          </div>
        )}

        {/* Cross-Modal Consistency */}
        {crossModal && (
          <>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Cross-Modal Consistency</span>
                <Badge 
                  variant={crossModal.consistencyScore >= 80 ? "fair" : crossModal.consistencyScore >= 60 ? "caution" : "bias"}
                >
                  {crossModal.consistencyScore}%
                </Badge>
              </div>
              <Progress value={crossModal.consistencyScore} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Skill Match */}
              <div className="p-2 rounded bg-muted/50">
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                  <CheckCircle className="h-3 w-3" /> Skill Match
                </div>
                <Badge variant={crossModal.skillMatchLevel === "high" ? "fair" : crossModal.skillMatchLevel === "medium" ? "caution" : "bias"}>
                  {crossModal.skillMatchLevel.toUpperCase()}
                </Badge>
              </div>

              {/* Bias Source */}
              <div className="p-2 rounded bg-muted/50">
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                  {getSourceIcon(crossModal.biasSource)} Primary Bias Source
                </div>
                <Badge variant="secondary">
                  {getSourceLabel(crossModal.biasSource)}
                </Badge>
              </div>
            </div>

            {/* Detected Biases */}
            <div className="space-y-2">
              <span className="text-xs font-medium text-muted-foreground">Bias Detection Status</span>
              <div className="grid grid-cols-3 gap-2">
                <div className={`p-2 rounded text-center ${crossModal.accentPenaltyDetected ? 'bg-bias-muted border border-bias/30' : 'bg-fair-muted border border-fair/30'}`}>
                  <Mic className={`h-4 w-4 mx-auto mb-1 ${crossModal.accentPenaltyDetected ? 'text-bias' : 'text-fair'}`} />
                  <p className="text-xs">Accent</p>
                  <Badge variant={crossModal.accentPenaltyDetected ? "bias" : "fair"} className="text-xs mt-1">
                    {crossModal.accentPenaltyDetected ? "Detected" : "Clear"}
                  </Badge>
                </div>
                <div className={`p-2 rounded text-center ${crossModal.fluencyBiasDetected ? 'bg-bias-muted border border-bias/30' : 'bg-fair-muted border border-fair/30'}`}>
                  <Languages className={`h-4 w-4 mx-auto mb-1 ${crossModal.fluencyBiasDetected ? 'text-bias' : 'text-fair'}`} />
                  <p className="text-xs">Fluency</p>
                  <Badge variant={crossModal.fluencyBiasDetected ? "bias" : "fair"} className="text-xs mt-1">
                    {crossModal.fluencyBiasDetected ? "Detected" : "Clear"}
                  </Badge>
                </div>
                <div className={`p-2 rounded text-center ${crossModal.visualBiasDetected ? 'bg-bias-muted border border-bias/30' : 'bg-fair-muted border border-fair/30'}`}>
                  <Eye className={`h-4 w-4 mx-auto mb-1 ${crossModal.visualBiasDetected ? 'text-bias' : 'text-fair'}`} />
                  <p className="text-xs">Visual</p>
                  <Badge variant={crossModal.visualBiasDetected ? "bias" : "fair"} className="text-xs mt-1">
                    {crossModal.visualBiasDetected ? "Detected" : "Clear"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Flags */}
            {crossModal.flags.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-medium text-muted-foreground">Consistency Flags</span>
                <div className="flex flex-wrap gap-1">
                  {crossModal.flags.map((flag, i) => (
                    <Badge key={i} variant="caution" className="text-xs">
                      {flag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Simulated insights when no cross-modal data */}
        {!crossModal && (hasVideo || hasAudio) && (
          <div className="p-3 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground">
              Cross-modal consistency analysis will be performed when pipeline runs.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}