import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Briefcase, X, Plus } from "lucide-react";
import { useFairHire } from "@/contexts/FairHireContext";
import { toast } from "sonner";

interface JobDescriptionModalProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const COMMON_SKILLS = [
  "JavaScript", "Python", "React", "Node.js", "SQL", "AWS",
  "Machine Learning", "Data Analysis", "Project Management",
  "Communication", "Leadership", "Problem Solving"
];

const LANGUAGES = ["English", "Spanish", "Mandarin", "Hindi", "French", "German", "Portuguese", "Arabic"];

export function JobDescriptionModal({ trigger, open, onOpenChange }: JobDescriptionModalProps) {
  const { createJobDescription } = useFairHire();
  const [isOpen, setIsOpen] = useState(false);
  
  const [roleTitle, setRoleTitle] = useState("");
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState("");
  const [experienceMin, setExperienceMin] = useState(2);
  const [experienceMax, setExperienceMax] = useState(5);
  const [languageRequirements, setLanguageRequirements] = useState<string[]>(["English"]);
  const [skillsWeight, setSkillsWeight] = useState(60);

  const controlledOpen = open !== undefined ? open : isOpen;
  const controlledOnOpenChange = onOpenChange || setIsOpen;

  const toggleSkill = (skill: string) => {
    setRequiredSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const addCustomSkill = () => {
    if (customSkill.trim() && !requiredSkills.includes(customSkill.trim())) {
      setRequiredSkills(prev => [...prev, customSkill.trim()]);
      setCustomSkill("");
    }
  };

  const toggleLanguage = (lang: string) => {
    setLanguageRequirements(prev => 
      prev.includes(lang) 
        ? prev.filter(l => l !== lang)
        : [...prev, lang]
    );
  };

  const handleSubmit = () => {
    if (!roleTitle.trim()) {
      toast.error("Please enter a role title");
      return;
    }
    if (requiredSkills.length === 0) {
      toast.error("Please select at least one required skill");
      return;
    }

    createJobDescription({
      roleTitle: roleTitle.trim(),
      requiredSkills,
      experienceRange: { min: experienceMin, max: experienceMax },
      languageRequirements,
      skillsWeight
    });

    toast.success("Job Description Created", {
      description: `${roleTitle} is now active. You can upload candidates.`
    });

    // Reset form
    setRoleTitle("");
    setRequiredSkills([]);
    setExperienceMin(2);
    setExperienceMax(5);
    setLanguageRequirements(["English"]);
    setSkillsWeight(60);
    
    controlledOnOpenChange(false);
  };

  return (
    <Dialog open={controlledOpen} onOpenChange={controlledOnOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Briefcase className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Create Job Description</DialogTitle>
              <DialogDescription>
                Define the role requirements. Candidates will be evaluated against this JD.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Role Title */}
          <div className="space-y-2">
            <Label htmlFor="roleTitle">Role Title *</Label>
            <Input
              id="roleTitle"
              placeholder="e.g., Senior Software Engineer"
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
            />
          </div>

          {/* Required Skills */}
          <div className="space-y-3">
            <Label>Required Skills *</Label>
            <div className="flex flex-wrap gap-2">
              {COMMON_SKILLS.map(skill => (
                <Badge
                  key={skill}
                  variant={requiredSkills.includes(skill) ? "default" : "outline"}
                  className="cursor-pointer transition-all hover:scale-105"
                  onClick={() => toggleSkill(skill)}
                >
                  {skill}
                  {requiredSkills.includes(skill) && (
                    <X className="ml-1 h-3 w-3" />
                  )}
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add custom skill..."
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCustomSkill()}
                className="flex-1"
              />
              <Button type="button" variant="outline" size="icon" onClick={addCustomSkill}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {requiredSkills.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                <span className="text-sm text-muted-foreground">Selected:</span>
                {requiredSkills.map(skill => (
                  <Badge key={skill} variant="secondary" className="cursor-pointer" onClick={() => toggleSkill(skill)}>
                    {skill}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Experience Range */}
          <div className="space-y-3">
            <Label>Experience Range (Years)</Label>
            <div className="flex items-center gap-4">
              <Input
                type="number"
                min={0}
                max={experienceMax}
                value={experienceMin}
                onChange={(e) => setExperienceMin(Number(e.target.value))}
                className="w-20"
              />
              <span className="text-muted-foreground">to</span>
              <Input
                type="number"
                min={experienceMin}
                max={30}
                value={experienceMax}
                onChange={(e) => setExperienceMax(Number(e.target.value))}
                className="w-20"
              />
              <span className="text-muted-foreground">years</span>
            </div>
          </div>

          {/* Language Requirements */}
          <div className="space-y-3">
            <Label>Language Requirements</Label>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map(lang => (
                <Badge
                  key={lang}
                  variant={languageRequirements.includes(lang) ? "default" : "outline"}
                  className="cursor-pointer transition-all hover:scale-105"
                  onClick={() => toggleLanguage(lang)}
                >
                  {lang}
                </Badge>
              ))}
            </div>
          </div>

          {/* Weightage Slider */}
          <div className="space-y-4">
            <Label>Evaluation Weightage</Label>
            <div className="px-2">
              <Slider
                value={[skillsWeight]}
                onValueChange={([value]) => setSkillsWeight(value)}
                min={20}
                max={80}
                step={5}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-sm">
              <div className="text-center">
                <div className="font-medium text-primary">{skillsWeight}%</div>
                <div className="text-muted-foreground">Skills</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-primary">{100 - skillsWeight}%</div>
                <div className="text-muted-foreground">Experience</div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => controlledOnOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="hero" onClick={handleSubmit}>
            Create Job Description
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
