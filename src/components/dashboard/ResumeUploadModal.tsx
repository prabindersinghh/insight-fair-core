import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, FileText, Video, Mic, CheckCircle, AlertCircle, Loader2, GraduationCap, Briefcase, Code } from "lucide-react";
import { useFairHire } from "@/contexts/FairHireContext";
import { parseResume, matchResumeToJD, type ParsedResume } from "@/lib/resumeParser";
import { toast } from "sonner";

interface ResumeUploadModalProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ResumeUploadModal({ trigger, open, onOpenChange }: ResumeUploadModalProps) {
  const { activeJD, candidates, addCandidateWithResume } = useFairHire();
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [file, setFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parsedResume, setParsedResume] = useState<ParsedResume | null>(null);
  const [candidateName, setCandidateName] = useState("");
  const [hasVideo, setHasVideo] = useState(false);
  const [hasAudio, setHasAudio] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  const controlledOpen = open !== undefined ? open : isOpen;
  const controlledOnOpenChange = onOpenChange || setIsOpen;

  const currentCandidateCount = activeJD 
    ? candidates.filter(c => c.jobDescriptionId === activeJD.id).length 
    : 0;
  const isAtLimit = currentCandidateCount >= 6;

  const resetForm = () => {
    setFile(null);
    setParsedResume(null);
    setCandidateName("");
    setHasVideo(false);
    setHasAudio(false);
    setParseError(null);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
    if (!validTypes.includes(selectedFile.type) && !selectedFile.name.match(/\.(pdf|docx|doc)$/i)) {
      setParseError("Please upload a PDF or DOCX file");
      return;
    }

    setFile(selectedFile);
    setIsParsing(true);
    setParseError(null);

    try {
      const parsed = await parseResume(selectedFile);
      setParsedResume(parsed);
      setCandidateName(parsed.candidateName);
      toast.success("Resume parsed successfully", {
        description: `Extracted ${parsed.skills.length} skills, ${parsed.experience.length} experience entries`
      });
    } catch (error) {
      console.error("Parse error:", error);
      setParseError(error instanceof Error ? error.message : "Failed to parse resume");
      toast.error("Failed to parse resume", {
        description: "Please ensure the file is a valid PDF or DOCX"
      });
    } finally {
      setIsParsing(false);
    }
  };

  const handleSubmit = () => {
    if (!parsedResume || !activeJD || !candidateName.trim()) {
      toast.error("Please upload and parse a resume first");
      return;
    }

    const jdMatchResult = matchResumeToJD(parsedResume, {
      requiredSkills: activeJD.requiredSkills,
      experienceRange: activeJD.experienceRange
    });

    const modalities: ("resume" | "video" | "audio")[] = ["resume"];
    if (hasVideo) modalities.push("video");
    if (hasAudio) modalities.push("audio");

    const candidate = addCandidateWithResume(
      candidateName.trim(),
      modalities,
      parsedResume,
      jdMatchResult,
      file?.name || "resume.pdf"
    );

    if (candidate) {
      toast.success("Candidate processed", {
        description: `${candidate.name} - JD Match: ${jdMatchResult.overallScore}%, Fair Score: ${candidate.adjustedScore}`
      });
      resetForm();
      controlledOnOpenChange(false);
    } else {
      toast.error("Failed to add candidate - maximum 6 per job");
    }
  };

  if (!activeJD) {
    return (
      <Dialog open={controlledOpen} onOpenChange={controlledOnOpenChange}>
        {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-caution">
              <AlertCircle className="h-5 w-5" />
              No Active Job Description
            </DialogTitle>
            <DialogDescription>
              Create a Job Description first to evaluate candidates against specific requirements.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => controlledOnOpenChange(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={controlledOpen} onOpenChange={(open) => { if (!open) resetForm(); controlledOnOpenChange(open); }}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Upload className="h-5 w-5 text-primary" />
              </div>
              <div>
                <DialogTitle>Upload Resume</DialogTitle>
                <DialogDescription>
                  Evaluating for: <span className="font-medium text-foreground">{activeJD.roleTitle}</span>
                </DialogDescription>
              </div>
            </div>
            <Badge variant={isAtLimit ? "bias" : "muted"}>{currentCandidateCount}/6</Badge>
          </div>
        </DialogHeader>

        {isAtLimit ? (
          <Card className="border-caution/50 bg-caution-muted">
            <CardContent className="p-4 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-caution-foreground" />
              <p className="text-sm text-caution-foreground">Maximum 6 candidates reached.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4 py-2">
            {/* File Upload */}
            <div className="space-y-2">
              <Label>Resume File (PDF or DOCX) *</Label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  file ? "border-fair bg-fair-muted" : "border-border hover:border-primary/50"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.doc"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                {isParsing ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span>Parsing resume...</span>
                  </div>
                ) : file ? (
                  <div className="flex items-center justify-center gap-2 text-fair">
                    <CheckCircle className="h-6 w-6" />
                    <span className="font-medium">{file.name}</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <FileText className="h-10 w-10 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Click to upload resume (PDF, DOCX)</p>
                  </div>
                )}
              </div>
              {parseError && <p className="text-sm text-bias">{parseError}</p>}
            </div>

            {/* Parsed Resume Preview */}
            {parsedResume && (
              <Card variant="elevated" className="border-fair/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-fair" />
                    Parsed Resume Preview
                    <Badge variant="fair" className="ml-auto">{parsedResume.parseConfidence}% confidence</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">Name</Label>
                      <Input 
                        value={candidateName} 
                        onChange={(e) => setCandidateName(e.target.value)}
                        className="mt-1 h-8"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Email</Label>
                      <p className="mt-1 truncate">{parsedResume.email || "Not detected"}</p>
                    </div>
                  </div>

                  {parsedResume.education.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                        <GraduationCap className="h-3 w-3" /> Education
                      </div>
                      {parsedResume.education.slice(0, 2).map((edu, i) => (
                        <p key={i} className="text-xs">{edu.degree} - {edu.institution} {edu.year && `(${edu.year})`}</p>
                      ))}
                    </div>
                  )}

                  {parsedResume.skills.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                        <Code className="h-3 w-3" /> Skills ({parsedResume.skills.length})
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {parsedResume.skills.slice(0, 8).map((skill, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">{skill}</Badge>
                        ))}
                        {parsedResume.skills.length > 8 && (
                          <Badge variant="muted" className="text-xs">+{parsedResume.skills.length - 8} more</Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {parsedResume.experience.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                        <Briefcase className="h-3 w-3" /> Experience ({parsedResume.experience.length} entries)
                      </div>
                      {parsedResume.experience.slice(0, 2).map((exp, i) => (
                        <p key={i} className="text-xs">{exp.title} at {exp.company}</p>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Optional modalities */}
            {parsedResume && (
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={hasVideo} onCheckedChange={(c) => setHasVideo(!!c)} />
                  <Video className="h-4 w-4" />
                  <span className="text-sm">Video Interview</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={hasAudio} onCheckedChange={(c) => setHasAudio(!!c)} />
                  <Mic className="h-4 w-4" />
                  <span className="text-sm">Audio Interview</span>
                </label>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => { resetForm(); controlledOnOpenChange(false); }}>
            Cancel
          </Button>
          {!isAtLimit && (
            <Button variant="hero" onClick={handleSubmit} disabled={!parsedResume || isParsing}>
              <Upload className="h-4 w-4 mr-2" />
              Process Candidate
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
