import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Loader2, Brain, FileText, Target, Video, Mic, ChevronDown } from "lucide-react";
import { Candidate, JobDescription } from "@/types/fairhire";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface Layer2RepresentationProps {
  candidate: Candidate;
  jobDescription: JobDescription;
  isActive: boolean;
  isComplete: boolean;
  onComplete: () => void;
}

export function Layer2Representation({ candidate, jobDescription, isActive, isComplete, onComplete }: Layer2RepresentationProps) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<"idle" | "resume" | "jd" | "multimodal" | "fusion" | "complete">("idle");
  const [isExpanded, setIsExpanded] = useState(true);
  const [currentMessage, setCurrentMessage] = useState("");

  const processingMessages = [
    "Loading transformer model weights...",
    "Generating resume text embeddings...",
    "Encoding job description requirements...",
    "Processing multimodal features...",
    "Fusing cross-modal representations...",
    "Embeddings ready for analysis..."
  ];

  // Keep expanded when active
  useEffect(() => {
    if (isActive) setIsExpanded(true);
  }, [isActive]);

  useEffect(() => {
    if (isActive && !isComplete) {
      setStage("resume");
      setProgress(0);
      setCurrentMessage(processingMessages[0]);

      // Varied progress
      let progressValue = 0;
      const interval = setInterval(() => {
        progressValue += Math.random() * 3 + 1;
        if (progressValue > 100) progressValue = 100;
        setProgress(Math.round(progressValue));
      }, 100);

      const timer0 = setTimeout(() => {
        setCurrentMessage(processingMessages[1]);
      }, 400);

      const timer1 = setTimeout(() => {
        setStage("jd");
        setCurrentMessage(processingMessages[2]);
      }, 1000);

      const timer2 = setTimeout(() => {
        setStage("multimodal");
        setCurrentMessage(processingMessages[3]);
      }, 1800);

      const timer3 = setTimeout(() => {
        setStage("fusion");
        setCurrentMessage(processingMessages[4]);
      }, 2600);

      const timer4 = setTimeout(() => {
        setProgress(100);
        setStage("complete");
        setCurrentMessage(processingMessages[5]);
      }, 3200);

      const timer5 = setTimeout(() => {
        onComplete();
      }, 3800);

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
      return <Badge variant="fair" className="text-xs gap-1"><CheckCircle className="h-3 w-3" /> Complete</Badge>;
    }
    if (stage === "resume") {
      return <Badge variant="caution" className="text-xs gap-1"><Loader2 className="h-3 w-3 animate-spin" /> Resume Embedding</Badge>;
    }
    if (stage === "jd") {
      return <Badge variant="caution" className="text-xs gap-1"><Loader2 className="h-3 w-3 animate-spin" /> JD Embedding</Badge>;
    }
    if (stage === "multimodal") {
      return <Badge variant="caution" className="text-xs gap-1"><Loader2 className="h-3 w-3 animate-spin" /> Multimodal Fusion</Badge>;
    }
    return <Badge variant="muted" className="text-xs">Pending</Badge>;
  };

  const hasVideo = candidate.modalities.includes("video");
  const hasAudio = candidate.modalities.includes("audio");

  return (
    <Card variant="elevated" className={`transition-all duration-500 ${isComplete ? "border-fair/40" : isActive ? "border-primary/40 ring-2 ring-primary/20 shadow-lg shadow-primary/10" : "border-border opacity-50"}`}>
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CardHeader className="pb-3">
          <CollapsibleTrigger className="w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isComplete ? "bg-fair text-fair-foreground" : isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  2
                </div>
                <div className="text-left">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Layer 2
                  </p>
                  <CardTitle className="text-base">Transformer-Based Representation Models</CardTitle>
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

            {/* Embedding visualizations */}
            <div className="space-y-3">
              {/* Resume Embedding */}
              <div className={`p-3 rounded-lg border transition-all ${(stage === "resume" || stage === "jd" || stage === "multimodal" || stage === "complete") ? "bg-fair/5 border-fair/30" : "bg-muted/30 border-border"}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className={`h-5 w-5 ${stage !== "idle" ? "text-fair" : "text-muted-foreground"}`} />
                    <div>
                      <p className="font-medium text-sm">Resume Text Embedding</p>
                      <p className="text-xs text-muted-foreground">768-dimensional vector representation</p>
                    </div>
                  </div>
                  {(stage === "jd" || stage === "multimodal" || stage === "complete") && (
                    <CheckCircle className="h-5 w-5 text-fair" />
                  )}
                  {stage === "resume" && (
                    <Loader2 className="h-5 w-5 text-primary animate-spin" />
                  )}
                </div>
              </div>

              {/* JD Embedding */}
              <div className={`p-3 rounded-lg border transition-all ${(stage === "jd" || stage === "multimodal" || stage === "complete") ? "bg-primary/5 border-primary/30" : "bg-muted/30 border-border"}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Target className={`h-5 w-5 ${(stage === "jd" || stage === "multimodal" || stage === "complete") ? "text-primary" : "text-muted-foreground"}`} />
                    <div>
                      <p className="font-medium text-sm">JD Embedding Generated</p>
                      <p className="text-xs text-muted-foreground">{jobDescription.roleTitle} requirements encoded</p>
                    </div>
                  </div>
                  {(stage === "multimodal" || stage === "complete") && (
                    <CheckCircle className="h-5 w-5 text-fair" />
                  )}
                  {stage === "jd" && (
                    <Loader2 className="h-5 w-5 text-primary animate-spin" />
                  )}
                </div>
              </div>

              {/* Multimodal Embeddings */}
              <div className={`p-3 rounded-lg border transition-all ${(stage === "multimodal" || stage === "complete") ? (hasVideo || hasAudio ? "bg-secondary/10 border-secondary/30" : "bg-muted/30 border-border") : "bg-muted/30 border-border"}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-1">
                      <Video className={`h-4 w-4 ${hasVideo ? "text-secondary" : "text-muted-foreground"}`} />
                      <Mic className={`h-4 w-4 ${hasAudio ? "text-secondary" : "text-muted-foreground"}`} />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Multimodal Embeddings</p>
                      <p className="text-xs text-muted-foreground">
                        {hasVideo && hasAudio 
                          ? "Visual + Speech embeddings generated"
                          : hasVideo 
                            ? "Visual embeddings generated"
                            : hasAudio
                              ? "Speech embeddings generated"
                              : "Resume-only mode (no interview data)"}
                      </p>
                    </div>
                  </div>
                  {stage === "complete" && (
                    <CheckCircle className="h-5 w-5 text-fair" />
                  )}
                  {stage === "multimodal" && (
                    <Loader2 className="h-5 w-5 text-primary animate-spin" />
                  )}
                </div>
              </div>
            </div>

            {/* Semantic space explanation */}
            {(isComplete || stage === "complete") && (
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 animate-fade-in">
                <div className="flex items-start gap-2">
                  <Brain className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-primary">Representation Complete</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Candidate data converted into comparable vector representations. Resume and JD are now 
                      in the same semantic space, enabling meaningful similarity comparison.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Status message */}
            <p className="text-xs text-muted-foreground italic border-t border-border pt-3">
              {isComplete
                ? "✓ All modalities encoded. Ready for cross-modal bias analysis."
                : "Converting raw data into transformer-based embeddings..."}
            </p>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
