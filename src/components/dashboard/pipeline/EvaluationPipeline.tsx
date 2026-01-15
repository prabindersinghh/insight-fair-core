import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Candidate, JobDescription } from "@/types/fairhire";
import { Layer1DataIngestion } from "./Layer1DataIngestion";
import { Layer2Representation } from "./Layer2Representation";
import { Layer3BiasAnalysis } from "./Layer3BiasAnalysis";
import { Layer4CausalFairness } from "./Layer4CausalFairness";
import { Layer5FinalScore } from "./Layer5FinalScore";
import { InterviewInsightsPanel } from "../InterviewInsightsPanel";
import { 
  Database, Brain, ShieldAlert, Scale, Sparkles, 
  ArrowDown, CheckCircle, Play, RotateCcw 
} from "lucide-react";

interface EvaluationPipelineProps {
  candidate: Candidate;
  jobDescription: JobDescription;
}

type PipelineStep = 1 | 2 | 3 | 4 | 5;

export function EvaluationPipeline({ candidate, jobDescription }: EvaluationPipelineProps) {
  const [currentStep, setCurrentStep] = useState<PipelineStep>(1);
  const [completedSteps, setCompletedSteps] = useState<Set<PipelineStep>>(new Set());
  const [isRunning, setIsRunning] = useState(false);
  const [pipelineComplete, setPipelineComplete] = useState(false);

  // Auto-run pipeline on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsRunning(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleStepComplete = useCallback((step: PipelineStep) => {
    setCompletedSteps(prev => new Set([...prev, step]));
    if (step < 5) {
      const nextStep = (step + 1) as PipelineStep;
      setCurrentStep(nextStep);
    } else {
      setPipelineComplete(true);
      setIsRunning(false);
    }
  }, []);

  const handleRestart = () => {
    setCompletedSteps(new Set());
    setCurrentStep(1);
    setPipelineComplete(false);
    setIsRunning(true);
  };

  const overallProgress = (completedSteps.size / 5) * 100;

  const stepIcons = [
    { icon: Database, label: "Data Ingestion" },
    { icon: Brain, label: "Representation" },
    { icon: ShieldAlert, label: "Bias Analysis" },
    { icon: Scale, label: "Causal Fairness" },
    { icon: Sparkles, label: "Final Score" },
  ];

  return (
    <div className="space-y-4">
      {/* Pipeline Header */}
      <Card variant="elevated" className="border-primary/30 bg-gradient-to-r from-primary/5 to-transparent">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                5-Layer Evaluation Pipeline
                {pipelineComplete && (
                  <Badge variant="fair" className="text-xs gap-1">
                    <CheckCircle className="h-3 w-3" /> Complete
                  </Badge>
                )}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Transparent, explainable candidate evaluation for {candidate.name}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {pipelineComplete && (
                <Button variant="outline" size="sm" onClick={handleRestart} className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Replay
                </Button>
              )}
              {!isRunning && !pipelineComplete && (
                <Button variant="hero" size="sm" onClick={() => setIsRunning(true)} className="gap-2">
                  <Play className="h-4 w-4" />
                  Start Pipeline
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-4">
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Overall Progress</span>
              <span>{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>

          {/* Step indicators */}
          <div className="flex items-center justify-between mt-4">
            {stepIcons.map((step, idx) => {
              const stepNum = (idx + 1) as PipelineStep;
              const isCompleted = completedSteps.has(stepNum);
              const isCurrent = currentStep === stepNum && isRunning;
              const Icon = step.icon;

              return (
                <div key={idx} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isCompleted
                          ? "bg-fair text-fair-foreground"
                          : isCurrent
                          ? "bg-primary text-primary-foreground ring-2 ring-primary/30"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </div>
                    <span className={`text-xs mt-1 ${isCurrent ? "text-primary font-medium" : "text-muted-foreground"}`}>
                      {step.label}
                    </span>
                  </div>
                  {idx < 4 && (
                    <div className={`w-8 h-0.5 mx-1 ${isCompleted ? "bg-fair" : "bg-border"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* JD Context - Always shown */}
      <Card variant="elevated" className="border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Database className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs font-medium text-primary uppercase tracking-wider">Evaluation Context</p>
              <p className="font-semibold">{jobDescription.roleTitle}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {jobDescription.requiredSkills.slice(0, 6).map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
            ))}
            {jobDescription.requiredSkills.length > 6 && (
              <Badge variant="muted" className="text-xs">+{jobDescription.requiredSkills.length - 6}</Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Experience: {jobDescription.experienceRange.min}-{jobDescription.experienceRange.max} years
          </p>
        </CardContent>
      </Card>

      {/* Arrow */}
      <div className="flex justify-center">
        <ArrowDown className="h-5 w-5 text-muted-foreground" />
      </div>

      {/* Pipeline Steps */}
      <div className="space-y-3">
        <Layer1DataIngestion
          candidate={candidate}
          isActive={currentStep === 1 && isRunning}
          isComplete={completedSteps.has(1)}
          onComplete={() => handleStepComplete(1)}
        />

        <Layer2Representation
          candidate={candidate}
          jobDescription={jobDescription}
          isActive={currentStep === 2 && isRunning}
          isComplete={completedSteps.has(2)}
          onComplete={() => handleStepComplete(2)}
        />

        <Layer3BiasAnalysis
          candidate={candidate}
          isActive={currentStep === 3 && isRunning}
          isComplete={completedSteps.has(3)}
          onComplete={() => handleStepComplete(3)}
        />

        <Layer4CausalFairness
          candidate={candidate}
          isActive={currentStep === 4 && isRunning}
          isComplete={completedSteps.has(4)}
          onComplete={() => handleStepComplete(4)}
        />

        <Layer5FinalScore
          candidate={candidate}
          isActive={currentStep === 5 && isRunning}
          isComplete={completedSteps.has(5)}
          onComplete={() => handleStepComplete(5)}
        />
      </div>

      {/* Interview Insights Panel - shown when pipeline complete */}
      {pipelineComplete && (
        <InterviewInsightsPanel candidate={candidate} />
      )}

      {/* Pipeline complete summary */}
      {pipelineComplete && (
        <Card variant="elevated" className="border-primary/30 bg-gradient-to-r from-primary/10 to-fair/10 animate-fade-in">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-fair">
                <CheckCircle className="h-5 w-5 text-fair-foreground" />
              </div>
              <div>
                <p className="font-semibold">Pipeline Complete</p>
                <p className="text-sm text-muted-foreground">
                  All 5 layers executed successfully. {candidate.name}'s evaluation is now fully explainable.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
