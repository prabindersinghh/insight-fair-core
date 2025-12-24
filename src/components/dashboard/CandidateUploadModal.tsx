import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileText, Video, Mic, Users, AlertCircle } from "lucide-react";
import { useFairHire } from "@/contexts/FairHireContext";
import { toast } from "sonner";

interface CandidateUploadModalProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CandidateUploadModal({ trigger, open, onOpenChange }: CandidateUploadModalProps) {
  const { activeJD, addCandidate, addSampleCandidates } = useFairHire();
  const [isOpen, setIsOpen] = useState(false);
  
  const [candidateName, setCandidateName] = useState("");
  const [hasResume, setHasResume] = useState(true);
  const [hasVideo, setHasVideo] = useState(false);
  const [hasAudio, setHasAudio] = useState(false);

  const controlledOpen = open !== undefined ? open : isOpen;
  const controlledOnOpenChange = onOpenChange || setIsOpen;

  const handleAddCandidate = () => {
    if (!candidateName.trim()) {
      toast.error("Please enter candidate name");
      return;
    }

    const modalities: ("resume" | "video" | "audio")[] = [];
    if (hasResume) modalities.push("resume");
    if (hasVideo) modalities.push("video");
    if (hasAudio) modalities.push("audio");

    if (modalities.length === 0) {
      toast.error("Please select at least one data source");
      return;
    }

    const candidate = addCandidate(candidateName.trim(), modalities);
    if (candidate) {
      toast.success("Candidate Added", {
        description: `${candidate.name} has been processed for ${activeJD?.roleTitle}.`
      });
      
      // Reset form
      setCandidateName("");
      setHasResume(true);
      setHasVideo(false);
      setHasAudio(false);
    }
  };

  const handleAddSampleCandidates = () => {
    addSampleCandidates();
    toast.success("Sample Candidates Added", {
      description: "6 sample candidates have been processed."
    });
    controlledOnOpenChange(false);
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
              You must create a Job Description before uploading candidates. Candidates are evaluated against the active JD.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => controlledOnOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={controlledOpen} onOpenChange={controlledOnOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Upload className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Upload Candidate Data</DialogTitle>
              <DialogDescription>
                Evaluating for: <span className="font-medium text-foreground">{activeJD.roleTitle}</span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Quick Add Sample Candidates */}
          <Card variant="elevated" className="border-dashed border-2 border-primary/30 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm">Demo Mode</p>
                    <p className="text-xs text-muted-foreground">Add 6 sample candidates instantly</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={handleAddSampleCandidates}>
                  Add Samples
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                or add individual candidate
              </span>
            </div>
          </div>

          {/* Candidate Name */}
          <div className="space-y-2">
            <Label htmlFor="candidateName">Candidate Name *</Label>
            <Input
              id="candidateName"
              placeholder="e.g., John Smith"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
            />
          </div>

          {/* Data Sources */}
          <div className="space-y-3">
            <Label>Data Sources *</Label>
            <div className="grid grid-cols-3 gap-3">
              <Card 
                variant={hasResume ? "elevated" : "default"}
                className={`cursor-pointer transition-all ${hasResume ? "ring-2 ring-primary" : "hover:border-primary/50"}`}
                onClick={() => setHasResume(!hasResume)}
              >
                <CardContent className="p-4 text-center">
                  <Checkbox checked={hasResume} className="sr-only" />
                  <FileText className={`h-8 w-8 mx-auto mb-2 ${hasResume ? "text-primary" : "text-muted-foreground"}`} />
                  <p className="text-sm font-medium">Resume</p>
                </CardContent>
              </Card>

              <Card 
                variant={hasVideo ? "elevated" : "default"}
                className={`cursor-pointer transition-all ${hasVideo ? "ring-2 ring-primary" : "hover:border-primary/50"}`}
                onClick={() => setHasVideo(!hasVideo)}
              >
                <CardContent className="p-4 text-center">
                  <Checkbox checked={hasVideo} className="sr-only" />
                  <Video className={`h-8 w-8 mx-auto mb-2 ${hasVideo ? "text-primary" : "text-muted-foreground"}`} />
                  <p className="text-sm font-medium">Video</p>
                </CardContent>
              </Card>

              <Card 
                variant={hasAudio ? "elevated" : "default"}
                className={`cursor-pointer transition-all ${hasAudio ? "ring-2 ring-primary" : "hover:border-primary/50"}`}
                onClick={() => setHasAudio(!hasAudio)}
              >
                <CardContent className="p-4 text-center">
                  <Checkbox checked={hasAudio} className="sr-only" />
                  <Mic className={`h-8 w-8 mx-auto mb-2 ${hasAudio ? "text-primary" : "text-muted-foreground"}`} />
                  <p className="text-sm font-medium">Audio</p>
                </CardContent>
              </Card>
            </div>
            <p className="text-xs text-muted-foreground">
              Select which data types are available for this candidate. More modalities enable more comprehensive bias detection.
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => controlledOnOpenChange(false)} className="sm:flex-1">
            Cancel
          </Button>
          <Button variant="hero" onClick={handleAddCandidate} className="sm:flex-1">
            <Upload className="h-4 w-4 mr-2" />
            Process Candidate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
