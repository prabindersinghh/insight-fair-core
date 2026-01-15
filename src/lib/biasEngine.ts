// Deterministic Bias Simulation Engine for FairHire360
// Rule-based, reproducible bias detection for hackathon demo

import type { 
  JobDescription, Candidate, BiasFactor, BiasType, ModalityScore, 
  CandidateExplanation, CounterfactualScenario, InterviewVideo, 
  CrossModalConsistency, BiasSource 
} from "@/types/fairhire";
import type { ParsedResume, JDMatchResult } from "./resumeParser";

// Deterministic hash for consistent results
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// Name patterns that trigger bias detection (for demo purposes)
const NAME_BIAS_PATTERNS = {
  high: ["Priya", "Fatima", "Nguyen", "Mohammed", "Lakshmi", "Xiao", "Dmitri"],
  medium: ["Maria", "Carlos", "Ahmed", "Wei", "Yuki", "Aisha"],
  low: ["Chen", "Kim", "Singh", "Park", "Lee", "Garcia"]
};

// Accent/language patterns
const LANGUAGE_MISMATCH_INDICATORS = ["Hindi", "Mandarin", "Spanish", "Arabic", "Portuguese", "Russian"];

export interface CandidateInput {
  name: string;
  position: string;
  modalities: ("resume" | "video" | "audio")[];
  parsedResume?: ParsedResume;
  jdMatchResult?: JDMatchResult;
  resumeFileName?: string;
  interviewVideo?: InterviewVideo;
}

// Generate cross-modal consistency analysis
function generateCrossModalConsistency(
  candidate: CandidateInput,
  biasFactors: BiasFactor[],
  jd: JobDescription
): CrossModalConsistency {
  const hasVideo = candidate.modalities.includes("video");
  const hasAudio = candidate.modalities.includes("audio");
  const hasResume = candidate.modalities.includes("resume");
  const hash = simpleHash(candidate.name + jd.id);
  
  // Determine primary bias source
  let biasSource: BiasSource = "text";
  const videoBias = biasFactors.filter(bf => 
    ["appearance_bias", "background_environment"].includes(bf.type)
  );
  const audioBias = biasFactors.filter(bf => 
    ["accent_penalty", "language_fluency"].includes(bf.type)
  );
  const textBias = biasFactors.filter(bf => 
    ["name_proxy", "gender_language", "institution_bias"].includes(bf.type)
  );
  
  if (videoBias.length > 0 && audioBias.length > 0) {
    biasSource = "multiple";
  } else if (videoBias.length > audioBias.length && videoBias.length > textBias.length) {
    biasSource = "video";
  } else if (audioBias.length > textBias.length) {
    biasSource = "audio";
  }
  
  // Check for specific bias types
  const accentPenaltyDetected = biasFactors.some(bf => bf.type === "accent_penalty");
  const fluencyBiasDetected = biasFactors.some(bf => bf.type === "language_fluency");
  const visualBiasDetected = biasFactors.some(bf => 
    bf.type === "appearance_bias" || bf.type === "background_environment"
  );
  
  // Skill match level based on JD match
  let skillMatchLevel: "low" | "medium" | "high" = "medium";
  if (candidate.jdMatchResult) {
    const matchPercent = (candidate.jdMatchResult.matchedSkills.length / 
      (candidate.jdMatchResult.matchedSkills.length + candidate.jdMatchResult.missingSkills.length)) * 100;
    skillMatchLevel = matchPercent >= 70 ? "high" : matchPercent >= 40 ? "medium" : "low";
  } else {
    skillMatchLevel = hash % 3 === 0 ? "high" : hash % 3 === 1 ? "medium" : "low";
  }
  
  // Calculate resume vs interview score disparity (simulated)
  const resumeVsInterviewScore = hasVideo || hasAudio 
    ? 65 + (hash % 30) 
    : 80 + (hash % 15); // Higher consistency when only resume
  
  // Overall consistency score
  const biasCount = biasFactors.length;
  const consistencyScore = Math.max(40, Math.min(95, 85 - (biasCount * 8) + (hash % 10)));
  
  // Generate flags
  const flags: string[] = [];
  if (accentPenaltyDetected && !hasAudio) {
    flags.push("Accent penalty without audio modality");
  }
  if (visualBiasDetected && !hasVideo) {
    flags.push("Visual bias without video modality");
  }
  if (resumeVsInterviewScore < 70) {
    flags.push("Resume-Interview score disparity");
  }
  if (skillMatchLevel === "low" && biasFactors.length > 2) {
    flags.push("Low skill match with multiple bias signals");
  }
  
  return {
    resumeVsInterviewScore,
    skillMatchLevel,
    accentPenaltyDetected,
    fluencyBiasDetected,
    visualBiasDetected,
    biasSource,
    consistencyScore,
    flags
  };
}

// Generate deterministic base score
function generateBaseATSScore(candidateName: string, jd: JobDescription): number {
  const hash = simpleHash(candidateName + jd.id);
  // Base score between 60-90
  return 60 + (hash % 31);
}

// Detect name-based bias
function detectNameBias(name: string, jd: JobDescription): BiasFactor | null {
  const firstName = name.split(" ")[0];
  
  for (const [severity, names] of Object.entries(NAME_BIAS_PATTERNS)) {
    if (names.some(n => firstName.toLowerCase().includes(n.toLowerCase()) || n.toLowerCase().includes(firstName.toLowerCase()))) {
      const contribution = severity === "high" ? -12 : severity === "medium" ? -8 : -4;
      return {
        type: "name_proxy",
        label: "Name-Based Bias",
        severity: severity as "low" | "medium" | "high",
        contribution,
        explanation: `Statistical analysis suggests the candidate's name may have triggered unconscious bias in ATS scoring algorithms.`,
        jdContext: `Name pattern detected that historically correlates with scoring penalties unrelated to ${jd.roleTitle} requirements.`
      };
    }
  }
  return null;
}

// Detect accent/language bias based on JD
function detectAccentBias(name: string, jd: JobDescription, hasAudio: boolean): BiasFactor | null {
  if (!hasAudio) return null;
  
  const hash = simpleHash(name + "accent");
  const hasAccentIndicator = hash % 3 === 0;
  
  if (hasAccentIndicator) {
    const jdRequiresEnglish = jd.languageRequirements.some(l => 
      l.toLowerCase().includes("english")
    );
    
    const severity = jdRequiresEnglish ? "medium" : "high";
    const contribution = severity === "high" ? -18 : -10;
    
    return {
      type: "accent_penalty",
      label: "Accent-Based Penalty",
      severity,
      contribution,
      explanation: `Non-native accent pattern detected in audio analysis. This was identified as a non-skill factor and corrected.`,
      jdContext: jdRequiresEnglish 
        ? `While ${jd.roleTitle} requires English proficiency, accent is not a valid competency indicator.`
        : `JD language requirements do not justify accent-based scoring penalties.`
    };
  }
  return null;
}

// Detect appearance bias from video
function detectAppearanceBias(name: string, jd: JobDescription, hasVideo: boolean): BiasFactor | null {
  if (!hasVideo) return null;
  
  const hash = simpleHash(name + "appearance");
  const hasAppearanceBias = hash % 4 === 0;
  
  if (hasAppearanceBias) {
    return {
      type: "appearance_bias",
      label: "Appearance-Related Bias",
      severity: "low",
      contribution: -5,
      explanation: `Video analysis detected appearance-correlated scoring factors unrelated to job competency.`,
      jdContext: `${jd.roleTitle} role does not require specific appearance attributes.`
    };
  }
  return null;
}

// Detect background/environment bias
function detectBackgroundBias(name: string, jd: JobDescription, hasVideo: boolean): BiasFactor | null {
  if (!hasVideo) return null;
  
  const hash = simpleHash(name + "background");
  const hasBackgroundBias = hash % 5 === 0;
  
  if (hasBackgroundBias) {
    return {
      type: "background_environment",
      label: "Background Environment Bias",
      severity: "low",
      contribution: -4,
      explanation: `Interview background and lighting conditions influenced initial scoring unfairly.`,
      jdContext: `Remote interview environment variance is not relevant to ${jd.roleTitle} performance.`
    };
  }
  return null;
}

// Detect gender-coded language in resume
function detectGenderLanguageBias(name: string, jd: JobDescription, hasResume: boolean, parsedResume?: ParsedResume): BiasFactor | null {
  if (!hasResume) return null;
  
  const hash = simpleHash(name + "gender");
  const hasGenderBias = hash % 4 === 1;
  
  // Check for actual gender-coded language in parsed resume
  const genderWords = ['assertive', 'aggressive', 'collaborative', 'nurturing', 'competitive', 'supportive'];
  let foundPattern = false;
  if (parsedResume) {
    foundPattern = genderWords.some(word => parsedResume.rawText.toLowerCase().includes(word));
  }
  
  if (hasGenderBias || foundPattern) {
    return {
      type: "gender_language",
      label: "Gender-Coded Language",
      severity: foundPattern ? "medium" : "low",
      contribution: foundPattern ? -8 : -5,
      explanation: parsedResume 
        ? `Resume phrasing contains language patterns historically associated with gender bias in ATS systems.`
        : `Resume contains language patterns historically associated with gender bias in ATS systems.`,
      jdContext: `${jd.roleTitle} evaluation should focus on skills, not gendered language patterns.`
    };
  }
  return null;
}

// Detect institution bias
function detectInstitutionBias(name: string, jd: JobDescription, hasResume: boolean, parsedResume?: ParsedResume): BiasFactor | null {
  if (!hasResume) return null;
  
  const hash = simpleHash(name + "institution");
  const hasInstitutionBias = hash % 6 === 0;
  
  // Check for non-elite institution patterns
  let institutionContext = "";
  if (parsedResume && parsedResume.education.length > 0) {
    const edu = parsedResume.education[0];
    institutionContext = edu.institution;
    // Simulate bias for non-"brand name" institutions
    const isNonElite = !/(stanford|mit|harvard|yale|princeton|berkeley|cambridge|oxford)/i.test(edu.institution);
    if (isNonElite && hasInstitutionBias) {
      return {
        type: "institution_bias",
        label: "Institution Proxy Bias",
        severity: "medium",
        contribution: -7,
        explanation: `Educational institution "${edu.institution}" may have influenced scoring beyond skill relevance. Credential verified: ${edu.degree}.`,
        jdContext: `${jd.roleTitle} requirements focus on skills and experience, not institutional prestige.`
      };
    }
  }
  
  if (hasInstitutionBias) {
    return {
      type: "institution_bias",
      label: "Institution Proxy Bias",
      severity: "low",
      contribution: -5,
      explanation: `Educational institution name may have influenced scoring beyond skill relevance.`,
      jdContext: `${jd.roleTitle} requirements focus on skills and experience, not institutional prestige.`
    };
  }
  return null;
}

// Detect resume language structure bias (NEW)
function detectResumeLanguageBias(parsedResume: ParsedResume | undefined, jd: JobDescription): BiasFactor | null {
  if (!parsedResume) return null;
  
  // Check for non-standard resume structure
  const hasNonStandardStructure = parsedResume.parseConfidence < 70;
  
  // Check for potential ESL patterns
  const eslPatterns = parsedResume.languages.some(l => !['English'].includes(l));
  
  if (hasNonStandardStructure || eslPatterns) {
    return {
      type: "language_fluency",
      label: "Resume Language Structure Bias",
      severity: "medium",
      contribution: -9,
      explanation: `Resume language structure or formatting differs from standard Western templates. This may indicate ESL background or international education, neither of which affects job competency.`,
      jdContext: `${jd.roleTitle} role should evaluate candidates on skill merit, not resume formatting conventions.`
    };
  }
  return null;
}

// Generate modality scores
function generateModalityScores(
  candidate: CandidateInput,
  jd: JobDescription,
  biasFactors: BiasFactor[]
): ModalityScore[] {
  const scores: ModalityScore[] = [];
  
  for (const modality of candidate.modalities) {
    const hash = simpleHash(candidate.name + modality + jd.id);
    const baseScore = 60 + (hash % 25);
    
    const modalityBias = biasFactors.filter(bf => {
      if (modality === "resume") return ["name_proxy", "gender_language", "institution_bias"].includes(bf.type);
      if (modality === "video") return ["appearance_bias", "background_environment"].includes(bf.type);
      if (modality === "audio") return ["accent_penalty", "language_fluency"].includes(bf.type);
      return false;
    });
    
    const totalPenalty = modalityBias.reduce((sum, bf) => sum + bf.contribution, 0);
    const adjustedScore = Math.min(95, Math.max(60, baseScore - totalPenalty));
    
    scores.push({
      modality,
      originalScore: baseScore,
      adjustedScore,
      biasFactors: modalityBias,
      confidenceScore: 85 + (hash % 12)
    });
  }
  
  return scores;
}

// Generate explanations
function generateExplanations(biasFactors: BiasFactor[], jd: JobDescription): CandidateExplanation[] {
  const explanations: CandidateExplanation[] = [];
  
  for (const bf of biasFactors) {
    explanations.push({
      type: "correction",
      title: `${bf.label} Corrected`,
      description: bf.explanation,
      impact: Math.abs(bf.contribution)
    });
  }
  
  // Add skill alignment confirmation
  explanations.push({
    type: "info",
    title: "Skills Alignment Confirmed",
    description: `Technical skills and experience remain the primary contributors to the adjusted score for ${jd.roleTitle}.`,
    impact: 0
  });
  
  return explanations;
}

// Generate counterfactual scenarios
function generateCounterfactuals(
  candidate: CandidateInput,
  originalScore: number,
  biasFactors: BiasFactor[]
): CounterfactualScenario[] {
  const scenarios: CounterfactualScenario[] = [];
  
  const nameBias = biasFactors.find(bf => bf.type === "name_proxy");
  if (nameBias) {
    scenarios.push({
      intervention: "Name changed to gender-neutral variant",
      originalOutcome: originalScore,
      counterfactualOutcome: originalScore + Math.abs(nameBias.contribution),
      biasDetected: true
    });
  }
  
  const accentBias = biasFactors.find(bf => bf.type === "accent_penalty");
  if (accentBias) {
    scenarios.push({
      intervention: "Accent normalized to native speaker",
      originalOutcome: originalScore,
      counterfactualOutcome: originalScore + Math.abs(accentBias.contribution),
      biasDetected: true
    });
  }
  
  const institutionBias = biasFactors.find(bf => bf.type === "institution_bias");
  if (institutionBias) {
    scenarios.push({
      intervention: "Institution anonymized",
      originalOutcome: originalScore,
      counterfactualOutcome: originalScore + Math.abs(institutionBias.contribution),
      biasDetected: Math.abs(institutionBias.contribution) > 3
    });
  }
  
  // Always add at least one scenario
  if (scenarios.length === 0) {
    scenarios.push({
      intervention: "All demographic markers anonymized",
      originalOutcome: originalScore,
      counterfactualOutcome: originalScore + 2,
      biasDetected: false
    });
  }
  
  return scenarios;
}

// Generate fairness summary
function generateFairnessSummary(
  biasFactors: BiasFactor[],
  originalScore: number,
  adjustedScore: number,
  jd: JobDescription,
  needsReview: boolean
): string {
  if (needsReview) {
    return `Low confidence assessment for ${jd.roleTitle}. Conflicting bias signals detected across modalities. Human review recommended before proceeding.`;
  }
  
  if (biasFactors.length === 0) {
    return `Candidate evaluation for ${jd.roleTitle} shows minimal bias indicators. Original assessment appears fair.`;
  }
  
  const correction = adjustedScore - originalScore;
  const topBias = biasFactors.sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution))[0];
  
  return `Fairness analysis for ${jd.roleTitle} identified ${biasFactors.length} bias factor(s). Primary correction: ${topBias.label} (${correction > 0 ? "+" : ""}${correction} points). Adjusted score reflects skill-based evaluation aligned with JD requirements.`;
}

// Determine if candidate needs review (at least 1 in 5)
function determineNeedsReview(name: string, index: number): boolean {
  // Ensure at least 1 in 5 candidates needs review
  const hash = simpleHash(name + "review");
  return index % 5 === 2 || hash % 7 === 0;
}

// Main function to process a candidate
export function processCandidate(
  input: CandidateInput,
  jd: JobDescription,
  index: number
): Candidate {
  const hasResume = input.modalities.includes("resume");
  const hasVideo = input.modalities.includes("video");
  const hasAudio = input.modalities.includes("audio");
  const parsedResume = input.parsedResume;
  const jdMatchResult = input.jdMatchResult;
  
  // Collect all bias factors
  const biasFactors: BiasFactor[] = [];
  
  const nameBias = detectNameBias(input.name, jd);
  if (nameBias) biasFactors.push(nameBias);
  
  const accentBias = detectAccentBias(input.name, jd, hasAudio);
  if (accentBias) biasFactors.push(accentBias);
  
  const appearanceBias = detectAppearanceBias(input.name, jd, hasVideo);
  if (appearanceBias) biasFactors.push(appearanceBias);
  
  const backgroundBias = detectBackgroundBias(input.name, jd, hasVideo);
  if (backgroundBias) biasFactors.push(backgroundBias);
  
  const genderBias = detectGenderLanguageBias(input.name, jd, hasResume, parsedResume);
  if (genderBias) biasFactors.push(genderBias);
  
  const institutionBias = detectInstitutionBias(input.name, jd, hasResume, parsedResume);
  if (institutionBias) biasFactors.push(institutionBias);
  
  const languageBias = detectResumeLanguageBias(parsedResume, jd);
  if (languageBias) biasFactors.push(languageBias);
  
  // Calculate base score using JD match result if available
  let originalScore: number;
  if (jdMatchResult) {
    // Use JD match as base, with slight variation
    originalScore = Math.max(60, Math.min(90, jdMatchResult.overallScore - 5 + simpleHash(input.name) % 10));
  } else {
    originalScore = generateBaseATSScore(input.name, jd);
  }
  
  const totalCorrection = biasFactors.reduce((sum, bf) => sum + Math.abs(bf.contribution), 0);
  const adjustedScore = Math.min(95, originalScore + totalCorrection);
  
  // Determine bias level
  const biasLevel: "low" | "medium" | "high" = 
    totalCorrection >= 15 ? "high" :
    totalCorrection >= 8 ? "medium" : "low";
  
  // Determine if needs review
  const needsReview = determineNeedsReview(input.name, index);
  
  // Generate all analysis data
  const modalityScores = generateModalityScores(input, jd, biasFactors);
  const explanations = generateExplanations(biasFactors, jd);
  const counterfactuals = generateCounterfactuals(input, originalScore, biasFactors);
  const fairnessSummary = generateFairnessSummary(biasFactors, originalScore, adjustedScore, jd, needsReview);
  
  // Add warning explanation if needs review
  if (needsReview) {
    explanations.unshift({
      type: "warning",
      title: "Low Confidence — Human Review Required",
      description: "Conflicting or ambiguous bias signals detected. System confidence is below threshold for automated correction.",
      impact: 0
    });
  }
  
  // Add parsed resume insights to explanations if available
  if (parsedResume && jdMatchResult) {
    explanations.push({
      type: "info",
      title: "Resume Parsed Successfully",
      description: `Extracted ${parsedResume.skills.length} skills, ${parsedResume.experience.length} experience entries, and ${parsedResume.education.length} education credentials from uploaded resume.`,
      impact: 0
    });
    
    if (jdMatchResult.matchedSkills.length > 0) {
      explanations.push({
        type: "detection",
        title: "JD Skill Match Analysis",
        description: `${jdMatchResult.matchedSkills.length} of ${jd.requiredSkills.length} required skills matched. ${jdMatchResult.missingSkills.length > 0 ? `Missing: ${jdMatchResult.missingSkills.slice(0, 3).join(', ')}` : 'All required skills present.'}`,
        impact: jdMatchResult.matchedSkills.length * 3
      });
    }
  }
  
  // Generate cross-modal consistency analysis
  const crossModalConsistency = generateCrossModalConsistency(input, biasFactors, jd);
  
  return {
    id: simpleHash(input.name + jd.id + Date.now().toString()).toString(36),
    name: input.name,
    position: jd.roleTitle,
    originalScore,
    adjustedScore,
    biasLevel,
    modalities: input.modalities,
    status: needsReview ? "review" : "processed",
    jobDescriptionId: jd.id,
    modalityScores,
    biasFactors,
    explanations,
    counterfactuals,
    fairnessSummary,
    processedAt: new Date(),
    parsedResume,
    jdMatchResult,
    resumeFileName: input.resumeFileName,
    interviewVideo: input.interviewVideo,
    crossModalConsistency
  };
}



// Calculate dashboard stats
export function calculateStats(candidates: Candidate[]): {
  candidatesAnalyzed: number;
  fairnessScore: number;
  biasCorrections: number;
  avgScoreChange: number;
} {
  if (candidates.length === 0) {
    return {
      candidatesAnalyzed: 0,
      fairnessScore: 0,
      biasCorrections: 0,
      avgScoreChange: 0
    };
  }
  
  const totalBiasFactors = candidates.reduce((sum, c) => sum + c.biasFactors.length, 0);
  const totalScoreChange = candidates.reduce((sum, c) => sum + (c.adjustedScore - c.originalScore), 0);
  
  // Calculate fairness score (higher = better, based on successful corrections)
  const avgCorrection = totalScoreChange / candidates.length;
  const fairnessScore = Math.min(100, 70 + avgCorrection * 2);
  
  return {
    candidatesAnalyzed: candidates.length,
    fairnessScore: Math.round(fairnessScore * 10) / 10,
    biasCorrections: totalBiasFactors,
    avgScoreChange: Math.round((totalScoreChange / candidates.length) * 10) / 10
  };
}

// Sample candidate templates for demo
export const SAMPLE_CANDIDATES: CandidateInput[] = [
  { name: "Sarah Chen", position: "", modalities: ["resume", "video", "audio"] },
  { name: "Marcus Johnson", position: "", modalities: ["resume", "video"] },
  { name: "Priya Sharma", position: "", modalities: ["resume", "audio"] },
  { name: "James Wilson", position: "", modalities: ["resume", "video", "audio"] },
  { name: "Fatima Al-Hassan", position: "", modalities: ["resume", "video", "audio"] },
  { name: "Wei Zhang", position: "", modalities: ["resume", "audio"] },
];
