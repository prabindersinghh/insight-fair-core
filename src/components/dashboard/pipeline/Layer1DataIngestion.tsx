import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FileText, CheckCircle, Loader2, Database, Code, GraduationCap, Briefcase, AlertCircle } from "lucide-react";
import { Candidate } from "@/types/fairhire";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

interface Layer1DataIngestionProps {
  candidate: Candidate;
  isActive: boolean;
  isComplete: boolean;
  onComplete: () => void;
}

export function Layer1DataIngestion({ candidate, isActive, isComplete, onComplete }: Layer1DataIngestionProps) {
  const [progress, setProgress] = useState(0);
  const [parsingStage, setParsingStage] = useState<"idle" | "extracting" | "parsing" | "complete">("idle");
  const [isExpanded, setIsExpanded] = useState(true);
  const parsedResume = candidate.parsedResume;

  // Keep expanded when active
  useEffect(() => {
    if (isActive) setIsExpanded(true);
  }, [isActive]);

  useEffect(() => {
    if (isActive && !isComplete) {
      setParsingStage("extracting");
      setProgress(0);

      // Slower, more visible animation
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev < 40) return prev + 2;
          if (prev < 100) return prev + 3;
          return prev;
        });
      }, 80);

      const timer1 = setTimeout(() => {
        setParsingStage("parsing");
      }, 1200);

      const timer2 = setTimeout(() => {
        setParsingStage("complete");
        setProgress(100);
      }, 2400);

      const timer3 = setTimeout(() => {
        onComplete();
      }, 3000);

      return () => {
        clearInterval(interval);
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    } else if (isComplete) {
      setProgress(100);
      setParsingStage("complete");
    }
  }, [isActive, isComplete, onComplete]);

  const getStatusBadge = () => {
    if (isComplete || parsingStage === "complete") {
      return <Badge variant="fair" className="text-xs gap-1"><CheckCircle className="h-3 w-3" /> Complete</Badge>;
    }
    if (parsingStage === "extracting") {
      return <Badge variant="caution" className="text-xs gap-1"><Loader2 className="h-3 w-3 animate-spin" /> Extracting Text</Badge>;
    }
    if (parsingStage === "parsing") {
      return <Badge variant="caution" className="text-xs gap-1"><Loader2 className="h-3 w-3 animate-spin" /> Parsing Content</Badge>;
    }
    return <Badge variant="muted" className="text-xs">Pending</Badge>;
  };

  // Pulse animation class for active state
  const pulseClass = isActive && !isComplete ? "animate-pulse" : "";

  return (
    <Card variant="elevated" className={`transition-all duration-500 ${isComplete ? "border-fair/40" : isActive ? "border-primary/40 ring-2 ring-primary/20 shadow-lg shadow-primary/10" : "border-border opacity-50"}`}>
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CardHeader className="pb-3">
          <CollapsibleTrigger className="w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isComplete ? "bg-fair text-fair-foreground" : isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  1
                </div>
                <div className="text-left">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Layer 1
                  </p>
                  <CardTitle className="text-base">Multimodal Data Ingestion Engine</CardTitle>
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
                  <span>Processing...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {/* Resume file info */}
            <div className="p-3 rounded-lg bg-muted/50 border border-border">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="font-medium text-sm">{candidate.resumeFileName || "Resume File"}</p>
                  <p className="text-xs text-muted-foreground">
                    {isComplete ? "Text extraction complete" : "Uploading and extracting..."}
                  </p>
                </div>
                {isComplete && <CheckCircle className="h-5 w-5 text-fair" />}
              </div>
            </div>

            {/* Extracted data summary */}
            {(isComplete || parsingStage === "complete") && parsedResume && (
              <div className="space-y-3 animate-fade-in">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-fair/5 border border-fair/20">
                    <div className="flex items-center gap-2 mb-1">
                      <Code className="h-4 w-4 text-fair" />
                      <span className="text-xs text-muted-foreground">Skills Extracted</span>
                    </div>
                    <p className="text-xl font-bold text-fair">{parsedResume.skills.length}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="flex items-center gap-2 mb-1">
                      <Briefcase className="h-4 w-4 text-primary" />
                      <span className="text-xs text-muted-foreground">Experience Entries</span>
                    </div>
                    <p className="text-xl font-bold text-primary">{parsedResume.experience.length}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-muted/50 border border-border">
                    <div className="flex items-center gap-2 mb-1">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Education</span>
                    </div>
                    <p className="text-xl font-bold">{parsedResume.education.length}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 border border-border">
                    <div className="flex items-center gap-2 mb-1">
                      <Database className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Parse Confidence</span>
                    </div>
                    <p className="text-xl font-bold">{Math.min(100, Math.max(0, Math.round(parsedResume.parseConfidence * 100)))}%</p>
                  </div>
                </div>

                {/* Skills preview */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Extracted Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {parsedResume.skills.slice(0, 10).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {parsedResume.skills.length > 10 && (
                      <Badge variant="muted" className="text-xs">+{parsedResume.skills.length - 10} more</Badge>
                    )}
                  </div>
                </div>

                {/* Modality info */}
                <div className="p-3 rounded-lg bg-muted/30 border border-border">
                  <p className="text-xs text-muted-foreground mb-2">Modalities Detected</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="fair" className="text-xs gap-1">
                      <FileText className="h-3 w-3" /> Resume
                    </Badge>
                    {candidate.modalities.includes("video") ? (
                      <Badge variant="secondary" className="text-xs gap-1">
                        <CheckCircle className="h-3 w-3" /> Video
                      </Badge>
                    ) : (
                      <Badge variant="muted" className="text-xs gap-1">
                        <AlertCircle className="h-3 w-3" /> No Video
                      </Badge>
                    )}
                    {candidate.modalities.includes("audio") ? (
                      <Badge variant="secondary" className="text-xs gap-1">
                        <CheckCircle className="h-3 w-3" /> Audio
                      </Badge>
                    ) : (
                      <Badge variant="muted" className="text-xs gap-1">
                        <AlertCircle className="h-3 w-3" /> No Audio
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Status message */}
            <p className="text-xs text-muted-foreground italic border-t border-border pt-3">
              {isComplete
                ? "✓ Data ingestion complete. Candidate data converted to structured format."
                : "Extracting and parsing candidate data from uploaded file..."}
            </p>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
