import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Briefcase, X, Plus, ChevronRight, Check, ArrowLeft, FileText } from "lucide-react";
import { useFairHire } from "@/contexts/FairHireContext";
import { toast } from "sonner";
import { TargetRoleType, JDParsedFeatures } from "@/types/fairhire";

interface JobDescriptionModalProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

// Target roles for Inclusion MVP Scope
const TARGET_ROLES: { role: TargetRoleType; description: string; suggestedSkills: string[]; sampleDescription: string }[] = [
  { 
    role: "Junior Data Analyst", 
    description: "Entry-level data analysis and reporting",
    suggestedSkills: ["Python", "SQL", "Data Analysis", "Problem Solving"],
    sampleDescription: "The candidate will work on data cleaning, creating reporting dashboards, writing SQL queries, and stakeholder communication. Daily tasks include analyzing datasets, generating insights, and presenting findings to business teams."
  },
  { 
    role: "Software Developer Intern", 
    description: "Software development internship position",
    suggestedSkills: ["JavaScript", "Python", "React", "Problem Solving"],
    sampleDescription: "The intern will assist with frontend development using React, participate in code reviews, write unit tests, and collaborate with senior developers on feature implementation."
  },
  { 
    role: "QA / Test Engineer", 
    description: "Quality assurance and testing",
    suggestedSkills: ["Problem Solving", "Communication"],
    sampleDescription: "The candidate will design and execute test cases, perform manual and automated testing, document bugs, and work with developers to ensure software quality across releases."
  },
  { 
    role: "IT Support Associate", 
    description: "Technical support and helpdesk",
    suggestedSkills: ["Communication", "Problem Solving"],
    sampleDescription: "The role involves providing technical support to internal users, troubleshooting hardware and software issues, managing helpdesk tickets, and documenting solutions for knowledge base."
  },
  { 
    role: "Business Analyst (Entry Level)", 
    description: "Business analysis and requirements gathering",
    suggestedSkills: ["Data Analysis", "Communication", "Problem Solving", "Project Management"],
    sampleDescription: "The candidate will gather business requirements, create process documentation, analyze workflows, and work with stakeholders to translate business needs into technical specifications."
  }
];

const COMMON_SKILLS = [
  "JavaScript", "Python", "React", "Node.js", "SQL", "AWS",
  "Machine Learning", "Data Analysis", "Project Management",
  "Communication", "Leadership", "Problem Solving"
];

const LANGUAGES = ["English", "Spanish", "Mandarin", "Hindi", "French", "German", "Portuguese", "Arabic"];

// Skill keywords for parsing
const SKILL_KEYWORDS: Record<string, string[]> = {
  technical: ["python", "javascript", "sql", "react", "node", "aws", "docker", "kubernetes", "git", "api", "database", "frontend", "backend", "testing", "automation", "excel", "tableau", "power bi", "machine learning", "data"],
  soft: ["communication", "teamwork", "leadership", "problem solving", "analytical", "presentation", "collaboration", "adaptable", "organized", "detail-oriented"]
};

// Domain keywords for parsing
const DOMAIN_KEYWORDS: Record<string, string[]> = {
  analytics: ["data", "analysis", "reporting", "dashboard", "insight", "metrics", "sql", "visualization", "tableau", "power bi"],
  development: ["code", "development", "programming", "software", "frontend", "backend", "api", "react", "javascript"],
  qa: ["test", "testing", "quality", "bug", "automation", "qa", "manual testing", "test case"],
  it_support: ["support", "helpdesk", "troubleshoot", "hardware", "software", "ticket", "user support"],
  business: ["requirements", "stakeholder", "process", "workflow", "documentation", "analysis", "business"]
};

// Parse JD description to extract features
function parseJDDescription(description: string): JDParsedFeatures {
  const lowerDesc = description.toLowerCase();
  
  // Extract detected skills
  const detectedSkills: string[] = [];
  [...SKILL_KEYWORDS.technical, ...SKILL_KEYWORDS.soft].forEach(skill => {
    if (lowerDesc.includes(skill) && !detectedSkills.includes(skill)) {
      // Capitalize first letter
      detectedSkills.push(skill.charAt(0).toUpperCase() + skill.slice(1));
    }
  });
  
  // Detect domain
  let maxDomainScore = 0;
  let detectedDomain: JDParsedFeatures["domain"] = "general";
  
  Object.entries(DOMAIN_KEYWORDS).forEach(([domain, keywords]) => {
    const score = keywords.filter(kw => lowerDesc.includes(kw)).length;
    if (score > maxDomainScore) {
      maxDomainScore = score;
      detectedDomain = domain as JDParsedFeatures["domain"];
    }
  });
  
  // Determine complexity based on description length and keyword density
  const wordCount = description.split(/\s+/).length;
  const keywordDensity = detectedSkills.length / Math.max(1, wordCount / 10);
  
  let complexityLevel: JDParsedFeatures["complexityLevel"] = "low";
  if (wordCount > 100 || detectedSkills.length > 5 || keywordDensity > 0.3) {
    complexityLevel = "high";
  } else if (wordCount > 50 || detectedSkills.length > 3) {
    complexityLevel = "medium";
  }
  
  // Extract important keywords
  const keywords = description
    .split(/[\s,;.]+/)
    .filter(word => word.length > 4)
    .slice(0, 10);
  
  return {
    detectedSkills,
    domain: detectedDomain,
    complexityLevel,
    keywords
  };
}

export function JobDescriptionModal({ trigger, open, onOpenChange }: JobDescriptionModalProps) {
  const { createJobDescription } = useFairHire();
  const [isOpen, setIsOpen] = useState(false);
  
  // Step management
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedRole, setSelectedRole] = useState<TargetRoleType | null>(null);
  
  // Form state
  const [roleTitle, setRoleTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState("");
  const [experienceMin, setExperienceMin] = useState(0);
  const [experienceMax, setExperienceMax] = useState(2);
  const [languageRequirements, setLanguageRequirements] = useState<string[]>(["English"]);
  const [skillsWeight, setSkillsWeight] = useState(60);

  const controlledOpen = open !== undefined ? open : isOpen;
  const controlledOnOpenChange = onOpenChange || setIsOpen;

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset to step 1 when closing
      setStep(1);
      setSelectedRole(null);
      resetForm();
    }
    controlledOnOpenChange(newOpen);
  };

  const resetForm = () => {
    setRoleTitle("");
    setDescription("");
    setRequiredSkills([]);
    setCustomSkill("");
    setExperienceMin(0);
    setExperienceMax(2);
    setLanguageRequirements(["English"]);
    setSkillsWeight(60);
  };

  const handleRoleSelect = (role: TargetRoleType) => {
    setSelectedRole(role);
  };

  const handleContinueToForm = () => {
    if (!selectedRole) return;
    
    // Pre-fill role title with selected role
    setRoleTitle(selectedRole);
    
    // Pre-select suggested skills and sample description for the role
    const roleConfig = TARGET_ROLES.find(r => r.role === selectedRole);
    if (roleConfig) {
      setRequiredSkills(roleConfig.suggestedSkills);
      setDescription(roleConfig.sampleDescription);
    }
    
    setStep(2);
  };

  const handleBackToRoleSelection = () => {
    setStep(1);
  };

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
    if (!selectedRole) {
      toast.error("Please select a target role");
      return;
    }
    if (!roleTitle.trim()) {
      toast.error("Please enter a role title");
      return;
    }
    const wordCount = description.trim().split(/\s+/).filter(w => w.length > 0).length;
    if (wordCount < 50) {
      toast.error("Please enter at least 50 words for meaningful job description.");
      return;
    }
    if (wordCount > 300) {
      toast.error("Job description cannot exceed 300 words.");
      return;
    }
    if (requiredSkills.length === 0) {
      toast.error("Please select at least one required skill");
      return;
    }

    // Parse the description to extract features
    const parsedFeatures = parseJDDescription(description);

    createJobDescription({
      roleTitle: roleTitle.trim(),
      roleType: selectedRole,
      description: description.trim(),
      parsedFeatures,
      requiredSkills,
      experienceRange: { min: experienceMin, max: experienceMax },
      languageRequirements,
      skillsWeight
    });

    toast.success("Job Description Created", {
      description: `${roleTitle} is now active. Detected ${parsedFeatures.detectedSkills.length} skills, ${parsedFeatures.domain} domain.`
    });

    // Reset everything
    setStep(1);
    setSelectedRole(null);
    resetForm();
    
    handleOpenChange(false);
  };

  const descriptionWordCount = description.trim().split(/\s+/).filter(w => w.length > 0).length;
  const isDescriptionValid = descriptionWordCount >= 50 && descriptionWordCount <= 300;
  const isDescriptionTooShort = descriptionWordCount < 50;
  const isDescriptionTooLong = descriptionWordCount > 300;

  return (
    <Dialog open={controlledOpen} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {step === 1 ? (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Briefcase className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <DialogTitle>Select Target Role</DialogTitle>
                  <DialogDescription>
                    Inclusion MVP Scope – Choose a role to evaluate candidates fairly
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="py-4 space-y-3">
              {TARGET_ROLES.map(({ role, description }) => (
                <button
                  key={role}
                  onClick={() => handleRoleSelect(role)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left flex items-center justify-between group hover:border-primary/50 hover:bg-primary/5 ${
                    selectedRole === role 
                      ? "border-primary bg-primary/10" 
                      : "border-border bg-card"
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{role}</span>
                      {selectedRole === role && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{description}</p>
                  </div>
                  <ChevronRight className={`h-5 w-5 transition-colors ${
                    selectedRole === role ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                  }`} />
                </button>
              ))}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => handleOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                variant="hero" 
                onClick={handleContinueToForm}
                disabled={!selectedRole}
              >
                Continue
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
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
              {/* Target Role Badge (Read-only) */}
              {selectedRole && (
                <div className="space-y-2">
                  <Label>Target Role</Label>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="text-sm py-1 px-3">
                      {selectedRole}
                    </Badge>
                    <button 
                      onClick={handleBackToRoleSelection}
                      className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                    >
                      <ArrowLeft className="h-3 w-3" />
                      Change
                    </button>
                  </div>
                </div>
              )}

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

              {/* Job Description (NEW) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="description" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Job Description *
                  </Label>
                  <span className={`text-xs ${
                    isDescriptionTooLong ? "text-destructive" : 
                    isDescriptionTooShort ? "text-caution" : 
                    "text-muted-foreground"
                  }`}>
                    {descriptionWordCount} / 300 words
                  </span>
                </div>
                <Textarea
                  id="description"
                  placeholder="Describe the role responsibilities, daily tasks, tools used, team context, and expectations (up to 300 words).&#10;&#10;Example:&#10;The candidate will work on data cleaning, reporting dashboards, SQL queries, stakeholder communication, and supporting senior analysts with business insights..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  className="resize-none"
                />
                {description.length > 0 && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>AI will parse this to extract skills, domain, and complexity for fair evaluation.</span>
                  </div>
                )}
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
              <Button variant="outline" onClick={handleBackToRoleSelection}>
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back
              </Button>
              <Button variant="hero" onClick={handleSubmit}>
                Create Job Description
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
