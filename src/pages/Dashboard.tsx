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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Filter, RefreshCw, ChevronLeft } from "lucide-react";
import { toast } from "sonner";

// Sample data
const candidates: Array<{
  id: string;
  name: string;
  position: string;
  originalScore: number;
  adjustedScore: number;
  biasLevel: "low" | "medium" | "high";
  modalities: ("resume" | "video" | "audio")[];
  status: "processed" | "review" | "pending";
}> = [
  {
    id: "1",
    name: "Sarah Chen",
    position: "Senior Software Engineer",
    originalScore: 72,
    adjustedScore: 84,
    biasLevel: "medium",
    modalities: ["resume", "video", "audio"],
    status: "processed",
  },
  {
    id: "2",
    name: "Marcus Johnson",
    position: "Product Manager",
    originalScore: 88,
    adjustedScore: 86,
    biasLevel: "low",
    modalities: ["resume", "video"],
    status: "processed",
  },
  {
    id: "3",
    name: "Priya Sharma",
    position: "Data Scientist",
    originalScore: 65,
    adjustedScore: 78,
    biasLevel: "high",
    modalities: ["resume", "audio"],
    status: "review",
  },
  {
    id: "4",
    name: "James Wilson",
    position: "UX Designer",
    originalScore: 81,
    adjustedScore: 82,
    biasLevel: "low",
    modalities: ["resume", "video", "audio"],
    status: "processed",
  },
];

const biasAttributionData = [
  { factor: "Name Proxy", contribution: -12, category: "negative" as const },
  { factor: "Accent Penalty", contribution: -18, category: "negative" as const },
  { factor: "Gender Language", contribution: -8, category: "negative" as const },
  { factor: "Institution Bias", contribution: -5, category: "negative" as const },
  { factor: "Skills Match", contribution: 15, category: "positive" as const },
  { factor: "Experience Relevance", contribution: 22, category: "positive" as const },
];

const modalityData = [
  {
    modality: "resume" as const,
    confidenceScore: 94,
    biasDetected: true,
    factors: [
      { name: "Gender-coded language", severity: "medium" as const },
      { name: "Name proxy", severity: "high" as const },
    ],
  },
  {
    modality: "video" as const,
    confidenceScore: 87,
    biasDetected: true,
    factors: [
      { name: "Eye contact normalization", severity: "low" as const },
      { name: "Background variance", severity: "low" as const },
    ],
  },
  {
    modality: "audio" as const,
    confidenceScore: 91,
    biasDetected: true,
    factors: [
      { name: "Accent penalty", severity: "high" as const },
      { name: "Fluency adjustment", severity: "medium" as const },
    ],
  },
];

const explanations = [
  {
    type: "correction" as const,
    title: "Accent Penalty Removed",
    description: "Non-native English accent contributed −18% to original score. This was identified as a non-skill factor and corrected.",
    impact: 18,
  },
  {
    type: "detection" as const,
    title: "Name-Based Bias Detected",
    description: "Statistical analysis suggests the candidate's name may have triggered unconscious bias in ATS scoring algorithms.",
    impact: -12,
  },
  {
    type: "correction" as const,
    title: "Eye Contact Normalization",
    description: "Eye contact patterns were flagged but normalized due to neurodivergence-safe evaluation protocols.",
    impact: 5,
  },
  {
    type: "info" as const,
    title: "Skills Alignment Confirmed",
    description: "Technical skills and experience remain the primary contributors to the adjusted score.",
    impact: 0,
  },
];

const counterfactualScenarios = [
  {
    intervention: "Name changed to gender-neutral variant",
    originalOutcome: 72,
    counterfactualOutcome: 79,
    biasDetected: true,
  },
  {
    intervention: "Accent normalized to native speaker",
    originalOutcome: 72,
    counterfactualOutcome: 85,
    biasDetected: true,
  },
  {
    intervention: "Institution anonymized",
    originalOutcome: 72,
    counterfactualOutcome: 74,
    biasDetected: false,
  },
];

const Dashboard = () => {
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);

  const handleDownloadReport = () => {
    toast.success("Report generated", {
      description: "Fairness audit report has been downloaded.",
    });
  };

  const handleUpload = () => {
    toast.info("Upload feature", {
      description: "This would open a file upload dialog for candidate data.",
    });
  };

  const selectedCandidateData = candidates.find(c => c.id === selectedCandidate);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            {selectedCandidate ? (
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedCandidate(null)}
                  className="gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </Button>
                <div>
                  <h1 className="font-display text-2xl font-bold">
                    {selectedCandidateData?.name}
                  </h1>
                  <p className="text-muted-foreground">
                    {selectedCandidateData?.position}
                  </p>
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
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="hero" size="sm" onClick={handleUpload}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Data
            </Button>
          </div>
        </div>

        {selectedCandidate ? (
          /* Candidate Detail View */
          <div className="space-y-6">
            {/* Score Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <BiasScoreCard
                title="Resume Score"
                originalScore={68}
                adjustedScore={79}
                biasContribution={-16}
                modality="resume"
              />
              <BiasScoreCard
                title="Video Score"
                originalScore={71}
                adjustedScore={82}
                biasContribution={-15}
                modality="video"
              />
              <BiasScoreCard
                title="Audio Score"
                originalScore={65}
                adjustedScore={81}
                biasContribution={-24}
                modality="audio"
              />
              <BiasScoreCard
                title="Overall Score"
                originalScore={selectedCandidateData?.originalScore || 0}
                adjustedScore={selectedCandidateData?.adjustedScore || 0}
                biasContribution={-16}
                modality="overall"
              />
            </div>

            {/* Fairness Gauges */}
            <div className="grid gap-4 md:grid-cols-3">
              <FairnessGauge
                score={87}
                label="Overall Fairness"
                description="Aggregate fairness across all modalities"
              />
              <FairnessGauge
                score={92}
                label="Causal Fairness"
                description="Score stability under counterfactual interventions"
              />
              <FairnessGauge
                score={78}
                label="Cross-Modal Consistency"
                description="Agreement between different input modalities"
              />
            </div>

            {/* Analysis Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
              <BiasAttributionChart data={biasAttributionData} />
              <ModalityBreakdown data={modalityData} />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <CounterfactualComparison scenarios={counterfactualScenarios} />
              <ExplainabilityPanel
                candidateName={selectedCandidateData?.name || ""}
                explanations={explanations}
                onDownloadReport={handleDownloadReport}
              />
            </div>
          </div>
        ) : (
          /* Overview View */
          <div className="space-y-8">
            {/* Stats */}
            <StatsOverview />

            {/* Candidates Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-semibold">Recent Candidates</h2>
                <Badge variant="secondary">{candidates.length} candidates</Badge>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {candidates.map((candidate, index) => (
                  <div
                    key={candidate.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CandidateCard
                      {...candidate}
                      onViewDetails={() => setSelectedCandidate(candidate.id)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Insights */}
            <div className="grid gap-6 lg:grid-cols-3">
              <FairnessGauge
                score={87}
                label="Avg. Fairness Score"
                description="Across all processed candidates"
              />
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="text-base">Top Bias Factors</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { name: "Accent Patterns", count: 124, severity: "high" },
                    { name: "Name Proxies", count: 89, severity: "medium" },
                    { name: "Institution Bias", count: 56, severity: "low" },
                  ].map((factor) => (
                    <div key={factor.name} className="flex items-center justify-between">
                      <span className="text-sm">{factor.name}</span>
                      <Badge 
                        variant={factor.severity === "high" ? "bias" : factor.severity === "medium" ? "caution" : "muted"}
                      >
                        {factor.count}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="text-base">Processing Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { label: "Processed", value: 1156, color: "bg-fair" },
                    { label: "Needs Review", value: 89, color: "bg-caution" },
                    { label: "Pending", value: 39, color: "bg-muted" },
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
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
