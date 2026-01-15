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

// Cross-modal bias source tracking
export type BiasSource = "text" | "audio" | "video" | "multiple";

// Interview video metadata
export interface InterviewVideo {
  fileName: string;
  fileSize: number;
  duration?: number; // in seconds
  uploadedAt: Date;
  format: string;
}

// Cross-modal consistency result
export interface CrossModalConsistency {
  resumeVsInterviewScore: number; // 0-100
  skillMatchLevel: "low" | "medium" | "high";
  accentPenaltyDetected: boolean;
  fluencyBiasDetected: boolean;
  visualBiasDetected: boolean;
  biasSource: BiasSource;
  consistencyScore: number; // 0-100
  flags: string[];
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
  // Resume parsing data
  parsedResume?: {
    rawText: string;
    candidateName: string;
    email: string;
    phone: string;
    education: { institution: string; degree: string; field: string; year: string }[];
    skills: string[];
    experience: { company: string; title: string; duration: string; description: string }[];
    projects: { name: string; description: string; technologies: string[] }[];
    languages: string[];
    summary: string;
    parseConfidence: number;
  };
  jdMatchResult?: {
    overallScore: number;
    matchedSkills: string[];
    missingSkills: string[];
    partialMatches: string[];
    experienceMatch: "below" | "meets" | "exceeds";
    experienceYears: number;
    strengthAreas: string[];
    improvementAreas: string[];
  };
  resumeFileName?: string;
  // NEW: Interview video data
  interviewVideo?: InterviewVideo;
  // NEW: Cross-modal consistency analysis
  crossModalConsistency?: CrossModalConsistency;
}

export interface DashboardStats {
  candidatesAnalyzed: number;
  fairnessScore: number;
  biasCorrections: number;
  avgScoreChange: number;
}
