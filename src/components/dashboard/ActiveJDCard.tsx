import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, ChevronDown, Clock, Users } from "lucide-react";
import { useFairHire } from "@/contexts/FairHireContext";
import { JobDescriptionModal } from "./JobDescriptionModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ActiveJDCard() {
  const { activeJD, jobDescriptions, setActiveJD, candidates } = useFairHire();

  const candidateCount = activeJD 
    ? candidates.filter(c => c.jobDescriptionId === activeJD.id).length 
    : 0;

  if (!activeJD) {
    return (
      <Card variant="elevated" className="border-dashed border-2 border-primary/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">No Active Job Description</p>
                <p className="text-xs text-muted-foreground">Create a JD to start evaluating candidates</p>
              </div>
            </div>
            <JobDescriptionModal
              trigger={
                <Button variant="hero" size="sm">
                  Create JD
                </Button>
              }
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="elevated">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Briefcase className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium text-sm">{activeJD.roleTitle}</p>
                <Badge variant="fair" className="text-xs">Active</Badge>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                {activeJD.roleType && (
                  <Badge variant="outline" className="text-xs font-normal">
                    {activeJD.roleType}
                  </Badge>
                )}
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {activeJD.experienceRange.min}-{activeJD.experienceRange.max} yrs
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {candidateCount} candidates
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {jobDescriptions.length > 1 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Switch JD
                    <ChevronDown className="ml-1 h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {jobDescriptions.map(jd => (
                    <DropdownMenuItem 
                      key={jd.id}
                      onClick={() => setActiveJD(jd)}
                      className={jd.id === activeJD.id ? "bg-primary/10" : ""}
                    >
                      {jd.roleTitle}
                      {jd.id === activeJD.id && (
                        <Badge variant="fair" className="ml-2 text-xs">Active</Badge>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <JobDescriptionModal
              trigger={
                <Button variant="outline" size="sm">
                  New JD
                </Button>
              }
            />
          </div>
        </div>

        {/* Skills Tags */}
        <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-border">
          {activeJD.requiredSkills.slice(0, 5).map(skill => (
            <Badge key={skill} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
          {activeJD.requiredSkills.length > 5 && (
            <Badge variant="muted" className="text-xs">
              +{activeJD.requiredSkills.length - 5} more
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
