// Core types for FairHire360

export interface JobDescription {
  id: string;
  roleTitle: string;
  requiredSkills: string[];
  experienceRange: { min: number; max: number };
  languageRequirements: string[];
  skillsWeight: number; // 0-100, experience weight = 100 - skillsWeight
  createdAt: Date;
}

export type BiasType = 
  | "name_proxy"
  | "accent_penalty"
  | "language_fluency"
  | "appearance_bias"
  | "background_environment"
  | "gender_language"
  | "institution_bias"
  | "age_proxy";

export interface BiasFactor {
  type: BiasType;
  label: string;
  severity: "low" | "medium" | "high";
  contribution: number; // negative = penalty, positive = correction
  explanation: string;
  jdContext: string; // How this relates to JD
}

export interface ModalityScore {
  modality: "resume" | "video" | "audio";
  originalScore: number;
  adjustedScore: number;
  biasFactors: BiasFactor[];
  confidenceScore: number;
}

export interface CandidateExplanation {
  type: "correction" | "detection" | "info" | "warning";
  title: string;
  description: string;
  impact: number;
}

export interface CounterfactualScenario {
  intervention: string;
  originalOutcome: number;
  counterfactualOutcome: number;
  biasDetected: boolean;
}

export interface Candidate {
  id: string;
  name: string;
  position: string;
  originalScore: number;
  adjustedScore: number;
  biasLevel: "low" | "medium" | "high";
  modalities: ("resume" | "video" | "audio")[];
  status: "processed" | "review" | "pending";
  jobDescriptionId: string;
  modalityScores: ModalityScore[];
  biasFactors: BiasFactor[];
  explanations: CandidateExplanation[];
  counterfactuals: CounterfactualScenario[];
  fairnessSummary: string;
  processedAt: Date;
}

export interface DashboardStats {
  candidatesAnalyzed: number;
  fairnessScore: number;
  biasCorrections: number;
  avgScoreChange: number;
}
