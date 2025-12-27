import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { CandidateCard } from "@/components/dashboard/CandidateCard";
import { ActiveJDCard } from "@/components/dashboard/ActiveJDCard";
import { ResumeUploadModal } from "@/components/dashboard/ResumeUploadModal";
import { EvaluationPipeline } from "@/components/dashboard/pipeline";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Filter, RefreshCw, ChevronLeft, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useFairHire } from "@/contexts/FairHireContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Dashboard = () => {
  const { activeJD, candidates, getCandidateById, statusFilter, setStatusFilter, refreshStats } = useFairHire();
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const filteredCandidates = candidates
    .filter(c => activeJD ? c.jobDescriptionId === activeJD.id : true)
    .filter(c => statusFilter === "all" || c.status === statusFilter);

  const selectedCandidate = selectedCandidateId ? getCandidateById(selectedCandidateId) : null;

  const handleDownloadReport = () => {
    toast.success("Report generated", {
      description: "Fairness audit report has been downloaded.",
    });
  };

  const handleRefresh = () => {
    refreshStats();
    toast.success("Dashboard refreshed", {
      description: "Metrics have been recalculated.",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Active JD Card - Always visible at top */}
        <div className="mb-6">
          <ActiveJDCard />
        </div>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            {selectedCandidate ? (
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={() => setSelectedCandidateId(null)} className="gap-2">
                  <ChevronLeft className="h-4 w-4" />
                  Back to Candidates
                </Button>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="font-display text-2xl font-bold">{selectedCandidate.name}</h1>
                    {selectedCandidate.status === "review" && (
                      <Badge variant="caution" className="flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Needs Review
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground">{selectedCandidate.position}</p>
                </div>
              </div>
            ) : (
              <>
                <h1 className="font-display text-3xl font-bold">Fairness Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                  Transparent, explainable evaluation pipeline
                </p>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  {statusFilter === "all" ? "All Status" : statusFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Status</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("processed")}>Processed</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("review")}>Needs Review</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("pending")}>Pending</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <ResumeUploadModal
              open={uploadModalOpen}
              onOpenChange={setUploadModalOpen}
              trigger={
                <Button variant="hero" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Resume
                </Button>
              }
            />
          </div>
        </div>

        {selectedCandidate && activeJD ? (
          /* CANDIDATE DETAIL VIEW - EXPLAINABLE PIPELINE */
          <div className="space-y-6">
            {/* Pipeline Header */}
            <div className="p-4 rounded-lg bg-muted/30 border border-border">
              <h2 className="font-display text-lg font-semibold mb-2">
                Evaluation Pipeline
              </h2>
              <p className="text-sm text-muted-foreground">
                Follow the step-by-step analysis below to understand how {selectedCandidate.name}'s 
                evaluation was computed. Each step builds upon the previous one.
              </p>
              <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                <Badge variant="secondary">JD Context</Badge>
                <ArrowDown className="h-3 w-3" />
                <Badge variant="secondary">Resume Parsing</Badge>
                <ArrowDown className="h-3 w-3" />
                <Badge variant="secondary">JD Matching</Badge>
                <ArrowDown className="h-3 w-3" />
                <Badge variant="secondary">Bias Detection</Badge>
                <ArrowDown className="h-3 w-3" />
                <Badge variant="secondary">Final Score</Badge>
              </div>
            </div>

            {/* STEP 0: Job Description Context */}
            <JDContextPanel jobDescription={activeJD} />

            {/* STEP 1: Resume Parsing Output */}
            <ParsedResumePanel candidate={selectedCandidate} />

            {/* STEP 2: JD-Resume Alignment */}
            <JDResumeAlignment candidate={selectedCandidate} />

            {/* STEP 3: Bias Signals Detection */}
            <BiasSignalsPanel 
              biasFactors={selectedCandidate.biasFactors} 
              candidateName={selectedCandidate.name}
            />

            {/* STEP 4: Score Evolution */}
            <ScoreEvolutionPanel
              originalScore={selectedCandidate.originalScore}
              adjustedScore={selectedCandidate.adjustedScore}
              jdMatchScore={selectedCandidate.jdMatchResult?.overallScore}
              biasFactorsCount={selectedCandidate.biasFactors.length}
            />

            {/* Additional Explainability */}
            <ExplainabilityPanel 
              candidateName={selectedCandidate.name} 
              explanations={selectedCandidate.explanations} 
              onDownloadReport={handleDownloadReport} 
            />

            {/* Pipeline Summary */}
            <Card variant="elevated" className="border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                <p className="text-sm">
                  <strong>Summary:</strong> {selectedCandidate.fairnessSummary}
                </p>
                {selectedCandidate.status === "review" && (
                  <p className="text-sm text-caution mt-2">
                    ⚠️ This candidate has been flagged for human review due to detected bias patterns 
                    that may require additional context.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          /* OVERVIEW VIEW */
          <div className="space-y-8">
            <StatsOverview />

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-semibold">
                  {activeJD ? `Candidates for ${activeJD.roleTitle}` : "All Candidates"}
                </h2>
                <Badge variant="secondary">{filteredCandidates.length} candidates</Badge>
              </div>
              
              {filteredCandidates.length === 0 ? (
                <Card variant="elevated" className="border-dashed">
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground mb-4">
                      {activeJD 
                        ? "No candidates uploaded yet. Upload a resume to start the explainable evaluation pipeline." 
                        : "Create a Job Description to begin evaluating candidates."}
                    </p>
                    {activeJD && (
                      <Button variant="hero" onClick={() => setUploadModalOpen(true)}>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Resume
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredCandidates.map((candidate, index) => (
                    <div key={candidate.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
                      <CandidateCard {...candidate} onViewDetails={() => setSelectedCandidateId(candidate.id)} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {filteredCandidates.length > 0 && (
              <div className="grid gap-6 lg:grid-cols-3">
                <Card variant="elevated">
                  <CardHeader>
                    <CardTitle className="text-base">Pipeline Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Each candidate goes through a 4-step evaluation:
                    </p>
                    <ol className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Badge variant="secondary" className="w-6 h-6 p-0 flex items-center justify-center">1</Badge>
                        Resume Parsing
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge variant="secondary" className="w-6 h-6 p-0 flex items-center justify-center">2</Badge>
                        JD Matching
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge variant="secondary" className="w-6 h-6 p-0 flex items-center justify-center">3</Badge>
                        Bias Detection
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge variant="secondary" className="w-6 h-6 p-0 flex items-center justify-center">4</Badge>
                        Score Adjustment
                      </li>
                    </ol>
                  </CardContent>
                </Card>

                <Card variant="elevated">
                  <CardHeader><CardTitle className="text-base">Top Bias Factors</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { name: "Accent Patterns", count: filteredCandidates.filter(c => c.biasFactors.some(bf => bf.type === "accent_penalty")).length, severity: "high" },
                      { name: "Name Proxies", count: filteredCandidates.filter(c => c.biasFactors.some(bf => bf.type === "name_proxy")).length, severity: "medium" },
                      { name: "Gender Language", count: filteredCandidates.filter(c => c.biasFactors.some(bf => bf.type === "gender_language")).length, severity: "low" },
                    ].map((factor) => (
                      <div key={factor.name} className="flex items-center justify-between">
                        <span className="text-sm">{factor.name}</span>
                        <Badge variant={factor.severity === "high" ? "bias" : factor.severity === "medium" ? "caution" : "muted"}>{factor.count}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card variant="elevated">
                  <CardHeader><CardTitle className="text-base">Processing Status</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { label: "Processed", value: filteredCandidates.filter(c => c.status === "processed").length, color: "bg-fair" },
                      { label: "Needs Review", value: filteredCandidates.filter(c => c.status === "review").length, color: "bg-caution" },
                      { label: "Pending", value: filteredCandidates.filter(c => c.status === "pending").length, color: "bg-muted" },
                    ].map((status) => (
                      <div key={status.label} className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${status.color}`} />
                        <span className="text-sm flex-1">{status.label}</span>
                        <span className="font-semibold">{status.value}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
