import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, GraduationCap, Briefcase, Code, Languages, FileCheck } from "lucide-react";
import { Candidate } from "@/types/fairhire";

interface ParsedResumePanelProps {
  candidate: Candidate;
}

export function ParsedResumePanel({ candidate }: ParsedResumePanelProps) {
  const parsedResume = candidate.parsedResume;

  if (!parsedResume) {
    return (
      <Card variant="elevated" className="border-dashed">
        <CardContent className="p-6 text-center">
          <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No resume data available</p>
        </CardContent>
      </Card>
    );
  }

  // Determine resume language style
  const getLanguageStyle = () => {
    const summary = parsedResume.summary.toLowerCase();
    if (summary.includes("led") || summary.includes("drove") || summary.includes("spearheaded")) {
      return { label: "Action-oriented", color: "fair" as const };
    } else if (summary.includes("helped") || summary.includes("assisted") || summary.includes("supported")) {
      return { label: "Collaborative", color: "caution" as const };
    }
    return { label: "Neutral", color: "secondary" as const };
  };

  const languageStyle = getLanguageStyle();

  return (
    <Card variant="elevated" className="border-fair/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-fair/10">
              <FileCheck className="h-4 w-4 text-fair" />
            </div>
            <div>
              <p className="text-xs font-medium text-fair uppercase tracking-wider">
                Step 1: Resume Parsing
              </p>
              <CardTitle className="text-lg">Parsed Resume Output</CardTitle>
            </div>
          </div>
          <Badge variant="fair" className="text-xs">
            {Math.round(parsedResume.parseConfidence * 100)}% Confidence
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Source indicator */}
        <div className="p-3 rounded-lg bg-muted/50 border border-border">
          <div className="flex items-center gap-2 text-sm">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Source:</span>
            <span className="font-medium">{candidate.resumeFileName || "Uploaded Resume"}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 italic">
            Parsed directly from uploaded resume file
          </p>
        </div>

        {/* Extracted Skills */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Code className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm font-medium">Extracted Skills</p>
            <Badge variant="muted" className="text-xs">{parsedResume.skills.length} found</Badge>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {parsedResume.skills.slice(0, 12).map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {parsedResume.skills.length > 12 && (
              <Badge variant="muted" className="text-xs">
                +{parsedResume.skills.length - 12} more
              </Badge>
            )}
          </div>
        </div>

        {/* Experience */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm font-medium">Experience Summary</p>
          </div>
          <div className="space-y-2">
            {parsedResume.experience.slice(0, 3).map((exp, idx) => (
              <div key={idx} className="p-2 rounded-md bg-muted/30 text-sm">
                <p className="font-medium">{exp.title}</p>
                <p className="text-muted-foreground text-xs">
                  {exp.company} • {exp.duration}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm font-medium">Education</p>
          </div>
          <div className="space-y-1.5">
            {parsedResume.education.map((edu, idx) => (
              <div key={idx} className="text-sm">
                <p className="font-medium">{edu.degree} in {edu.field}</p>
                <p className="text-muted-foreground text-xs">{edu.institution} • {edu.year}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Languages */}
        {parsedResume.languages.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Languages className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium">Languages</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {parsedResume.languages.map((lang) => (
                <Badge key={lang} variant="muted" className="text-xs">
                  {lang}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Resume Language Signals */}
        <div className="pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground mb-1.5">Resume Language Style</p>
          <Badge variant={languageStyle.color} className="text-xs">
            {languageStyle.label}
          </Badge>
          <p className="text-xs text-muted-foreground mt-2 italic">
            Language patterns may influence traditional ATS scoring
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
