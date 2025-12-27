import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { CandidateCard } from "@/components/dashboard/CandidateCard";
import { BiasScoreCard } from "@/components/dashboard/BiasScoreCard";
import { BiasAttributionChart } from "@/components/dashboard/BiasAttributionChart";
import { ModalityBreakdown } from "@/components/dashboard/ModalityBreakdown";
import { ExplainabilityPanel } from "@/components/dashboard/ExplainabilityPanel";
import { CounterfactualComparison } from "@/components/dashboard/CounterfactualComparison";
import { FairnessGauge } from "@/components/dashboard/FairnessGauge";
import { ActiveJDCard } from "@/components/dashboard/ActiveJDCard";
import { ResumeUploadModal } from "@/components/dashboard/ResumeUploadModal";
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

  // Transform candidate data for components
  const biasAttributionData = selectedCandidate?.biasFactors.map(bf => ({
    factor: bf.label,
    contribution: bf.contribution,
    category: bf.contribution < 0 ? "negative" as const : "positive" as const
  })) || [];

  const modalityData = selectedCandidate?.modalityScores.map(ms => ({
    modality: ms.modality,
    confidenceScore: ms.confidenceScore,
    biasDetected: ms.biasFactors.length > 0,
    factors: ms.biasFactors.map(bf => ({
      name: bf.label,
      severity: bf.severity
    }))
  })) || [];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Active JD Card */}
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
                  Back
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
                  Monitor and analyze recruitment bias across candidates
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

        {selectedCandidate ? (
          /* Candidate Detail View */
          <div className="space-y-6">
            {/* Fairness Summary */}
            <Card variant="elevated" className={selectedCandidate.status === "review" ? "border-caution/50" : ""}>
              <CardContent className="p-4">
                <p className="text-sm">{selectedCandidate.fairnessSummary}</p>
              </CardContent>
            </Card>

            {/* Score Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {selectedCandidate.modalityScores.map(ms => (
                <BiasScoreCard
                  key={ms.modality}
                  title={`${ms.modality.charAt(0).toUpperCase() + ms.modality.slice(1)} Score`}
                  originalScore={ms.originalScore}
                  adjustedScore={ms.adjustedScore}
                  biasContribution={ms.biasFactors.reduce((s, bf) => s + bf.contribution, 0)}
                  modality={ms.modality}
                />
              ))}
              <BiasScoreCard
                title="Overall Score"
                originalScore={selectedCandidate.originalScore}
                adjustedScore={selectedCandidate.adjustedScore}
                biasContribution={selectedCandidate.adjustedScore - selectedCandidate.originalScore}
                modality="overall"
              />
            </div>

            {/* Fairness Gauges */}
            <div className="grid gap-4 md:grid-cols-3">
              <FairnessGauge score={Math.min(95, 70 + (selectedCandidate.adjustedScore - selectedCandidate.originalScore) * 2)} label="Overall Fairness" description="Aggregate fairness across all modalities" />
              <FairnessGauge score={selectedCandidate.counterfactuals.filter(c => !c.biasDetected).length > 0 ? 92 : 78} label="Causal Fairness" description="Score stability under counterfactual interventions" />
              <FairnessGauge score={selectedCandidate.modalityScores.length > 1 ? 85 : 95} label="Cross-Modal Consistency" description="Agreement between different input modalities" />
            </div>

            {/* Analysis Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
              <BiasAttributionChart data={biasAttributionData} />
              <ModalityBreakdown data={modalityData} />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <CounterfactualComparison scenarios={selectedCandidate.counterfactuals} />
              <ExplainabilityPanel candidateName={selectedCandidate.name} explanations={selectedCandidate.explanations} onDownloadReport={handleDownloadReport} />
            </div>
          </div>
        ) : (
          /* Overview View */
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
                      {activeJD ? "No candidates uploaded yet. Add candidates to start bias analysis." : "Create a Job Description to begin."}
                    </p>
                    {activeJD && (
                      <Button variant="hero" onClick={() => setUploadModalOpen(true)}>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Candidates
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
                <FairnessGauge score={87} label="Avg. Fairness Score" description="Across all processed candidates" />
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