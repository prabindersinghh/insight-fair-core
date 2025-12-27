import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Target, Clock, Code } from "lucide-react";
import { JobDescription } from "@/types/fairhire";

interface JDContextPanelProps {
  jobDescription: JobDescription;
}

export function JDContextPanel({ jobDescription }: JDContextPanelProps) {
  return (
    <Card variant="elevated" className="border-primary/30 bg-primary/5">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Target className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-xs font-medium text-primary uppercase tracking-wider">
              Evaluation Context
            </p>
            <CardTitle className="text-lg">Active Job Description</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Job Title */}
        <div className="flex items-center gap-3">
          <Briefcase className="h-5 w-5 text-muted-foreground shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground">Position</p>
            <p className="font-semibold text-lg">{jobDescription.roleTitle}</p>
          </div>
        </div>

        {/* Experience Range */}
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-muted-foreground shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground">Experience Required</p>
            <p className="font-medium">
              {jobDescription.experienceRange.min} - {jobDescription.experienceRange.max} years
            </p>
          </div>
        </div>

        {/* Required Skills */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Code className="h-4 w-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground font-medium">Required Skills</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {jobDescription.requiredSkills.map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Languages if any */}
        {jobDescription.languageRequirements.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground mb-1.5">Language Requirements</p>
            <div className="flex flex-wrap gap-1.5">
              {jobDescription.languageRequirements.map((lang) => (
                <Badge key={lang} variant="muted" className="text-xs">
                  {lang}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs text-muted-foreground italic pt-2 border-t border-border">
          All candidates are evaluated strictly relative to these job requirements.
        </p>
      </CardContent>
    </Card>
  );
}
