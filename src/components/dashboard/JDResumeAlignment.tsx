import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, CheckCircle, XCircle, AlertCircle, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Candidate } from "@/types/fairhire";

interface JDResumeAlignmentProps {
  candidate: Candidate;
}

export function JDResumeAlignment({ candidate }: JDResumeAlignmentProps) {
  const matchResult = candidate.jdMatchResult;

  if (!matchResult) {
    return (
      <Card variant="elevated" className="border-dashed">
        <CardContent className="p-6 text-center">
          <Target className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">JD matching not available</p>
        </CardContent>
      </Card>
    );
  }

  const experienceIcon = {
    below: { icon: TrendingDown, color: "text-bias", label: "Below Required" },
    meets: { icon: Minus, color: "text-fair", label: "Meets Requirements" },
    exceeds: { icon: TrendingUp, color: "text-primary", label: "Exceeds Requirements" },
  };

  const ExpIcon = experienceIcon[matchResult.experienceMatch].icon;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-fair";
    if (score >= 60) return "text-caution";
    return "text-bias";
  };

  return (
    <Card variant="elevated" className="border-caution/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-caution/10">
              <Target className="h-4 w-4 text-caution" />
            </div>
            <div>
              <p className="text-xs font-medium text-caution uppercase tracking-wider">
                Step 2: JD Matching
              </p>
              <CardTitle className="text-lg">JD–Resume Alignment</CardTitle>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Match Score */}
        <div className="p-4 rounded-lg bg-muted/50 border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">JD Match Score</span>
            <span className={`text-2xl font-bold ${getScoreColor(matchResult.overallScore)}`}>
              {matchResult.overallScore}%
            </span>
          </div>
          <Progress 
            value={matchResult.overallScore} 
            className="h-2"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Based on skill overlap and experience alignment
          </p>
        </div>

        {/* Experience Match */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
          <ExpIcon className={`h-5 w-5 ${experienceIcon[matchResult.experienceMatch].color}`} />
          <div>
            <p className="text-sm font-medium">Experience: {matchResult.experienceYears} years</p>
            <p className={`text-xs ${experienceIcon[matchResult.experienceMatch].color}`}>
              {experienceIcon[matchResult.experienceMatch].label}
            </p>
          </div>
        </div>

        {/* Matched Skills */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-fair" />
            <p className="text-sm font-medium text-fair">Matched Skills</p>
            <Badge variant="fair" className="text-xs">{matchResult.matchedSkills.length}</Badge>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {matchResult.matchedSkills.map((skill) => (
              <Badge key={skill} variant="fair" className="text-xs">
                {skill}
              </Badge>
            ))}
            {matchResult.matchedSkills.length === 0 && (
              <span className="text-xs text-muted-foreground">No exact matches</span>
            )}
          </div>
        </div>

        {/* Partial Matches */}
        {matchResult.partialMatches.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-caution" />
              <p className="text-sm font-medium text-caution">Partial Matches</p>
              <Badge variant="caution" className="text-xs">{matchResult.partialMatches.length}</Badge>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {matchResult.partialMatches.map((skill) => (
                <Badge key={skill} variant="caution" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Missing Skills */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="h-4 w-4 text-bias" />
            <p className="text-sm font-medium text-bias">Missing Skills</p>
            <Badge variant="bias" className="text-xs">{matchResult.missingSkills.length}</Badge>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {matchResult.missingSkills.map((skill) => (
              <Badge key={skill} variant="bias" className="text-xs">
                {skill}
              </Badge>
            ))}
            {matchResult.missingSkills.length === 0 && (
              <span className="text-xs text-muted-foreground">All required skills present</span>
            )}
          </div>
        </div>

        {/* Strengths & Improvements */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground mb-1.5">Strength Areas</p>
            <ul className="space-y-1">
              {matchResult.strengthAreas.slice(0, 2).map((area, idx) => (
                <li key={idx} className="text-xs text-fair flex items-start gap-1">
                  <CheckCircle className="h-3 w-3 mt-0.5 shrink-0" />
                  {area}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1.5">Improvement Areas</p>
            <ul className="space-y-1">
              {matchResult.improvementAreas.slice(0, 2).map((area, idx) => (
                <li key={idx} className="text-xs text-caution flex items-start gap-1">
                  <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
                  {area}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="text-xs text-muted-foreground italic pt-2 border-t border-border">
          Candidate evaluated strictly relative to job requirements.
        </p>
      </CardContent>
    </Card>
  );
}
