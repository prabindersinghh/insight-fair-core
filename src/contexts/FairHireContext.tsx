import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { JobDescription, Candidate, DashboardStats } from "@/types/fairhire";
import { processCandidate, calculateStats, SAMPLE_CANDIDATES } from "@/lib/biasEngine";

interface FairHireContextType {
  // Job Description
  activeJD: JobDescription | null;
  jobDescriptions: JobDescription[];
  createJobDescription: (jd: Omit<JobDescription, "id" | "createdAt">) => JobDescription;
  setActiveJD: (jd: JobDescription | null) => void;
  
  // Candidates
  candidates: Candidate[];
  addCandidate: (name: string, modalities: ("resume" | "video" | "audio")[]) => Candidate | null;
  addSampleCandidates: () => void;
  clearCandidates: () => void;
  getCandidateById: (id: string) => Candidate | undefined;
  
  // Stats
  stats: DashboardStats;
  refreshStats: () => void;
  
  // Filters
  statusFilter: "all" | "processed" | "review" | "pending";
  setStatusFilter: (filter: "all" | "processed" | "review" | "pending") => void;
}

const FairHireContext = createContext<FairHireContextType | undefined>(undefined);

const STORAGE_KEY = "fairhire360_state";

interface StoredState {
  activeJDId: string | null;
  jobDescriptions: JobDescription[];
  candidates: Candidate[];
}

function loadFromStorage(): StoredState | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert date strings back to Date objects
      if (parsed.jobDescriptions) {
        parsed.jobDescriptions = parsed.jobDescriptions.map((jd: JobDescription) => ({
          ...jd,
          createdAt: new Date(jd.createdAt)
        }));
      }
      if (parsed.candidates) {
        parsed.candidates = parsed.candidates.map((c: Candidate) => ({
          ...c,
          processedAt: new Date(c.processedAt)
        }));
      }
      return parsed;
    }
  } catch (error) {
    console.error("Failed to load from storage:", error);
  }
  return null;
}

function saveToStorage(state: StoredState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Failed to save to storage:", error);
  }
}

export function FairHireProvider({ children }: { children: React.ReactNode }) {
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>([]);
  const [activeJD, setActiveJDState] = useState<JobDescription | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    candidatesAnalyzed: 0,
    fairnessScore: 0,
    biasCorrections: 0,
    avgScoreChange: 0
  });
  const [statusFilter, setStatusFilter] = useState<"all" | "processed" | "review" | "pending">("all");
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from storage on mount
  useEffect(() => {
    const stored = loadFromStorage();
    if (stored) {
      setJobDescriptions(stored.jobDescriptions);
      setCandidates(stored.candidates);
      if (stored.activeJDId) {
        const activeJob = stored.jobDescriptions.find(jd => jd.id === stored.activeJDId);
        if (activeJob) {
          setActiveJDState(activeJob);
        }
      }
    }
    setIsInitialized(true);
  }, []);

  // Save to storage when state changes
  useEffect(() => {
    if (isInitialized) {
      saveToStorage({
        activeJDId: activeJD?.id || null,
        jobDescriptions,
        candidates
      });
    }
  }, [jobDescriptions, candidates, activeJD, isInitialized]);

  // Update stats when candidates change
  useEffect(() => {
    const filteredCandidates = activeJD 
      ? candidates.filter(c => c.jobDescriptionId === activeJD.id)
      : candidates;
    setStats(calculateStats(filteredCandidates));
  }, [candidates, activeJD]);

  const createJobDescription = useCallback((jdInput: Omit<JobDescription, "id" | "createdAt">): JobDescription => {
    const newJD: JobDescription = {
      ...jdInput,
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 9),
      createdAt: new Date()
    };
    setJobDescriptions(prev => [...prev, newJD]);
    setActiveJDState(newJD);
    return newJD;
  }, []);

  const setActiveJD = useCallback((jd: JobDescription | null) => {
    setActiveJDState(jd);
  }, []);

  const addCandidate = useCallback((name: string, modalities: ("resume" | "video" | "audio")[]): Candidate | null => {
    if (!activeJD) return null;
    
    const candidateInput = { name, position: activeJD.roleTitle, modalities };
    const currentCandidates = candidates.filter(c => c.jobDescriptionId === activeJD.id);
    const newCandidate = processCandidate(candidateInput, activeJD, currentCandidates.length);
    
    setCandidates(prev => [...prev, newCandidate]);
    return newCandidate;
  }, [activeJD, candidates]);

  const addSampleCandidates = useCallback(() => {
    if (!activeJD) return;
    
    const currentCandidates = candidates.filter(c => c.jobDescriptionId === activeJD.id);
    const newCandidates = SAMPLE_CANDIDATES.map((sample, index) => 
      processCandidate(sample, activeJD, currentCandidates.length + index)
    );
    
    setCandidates(prev => [...prev, ...newCandidates]);
  }, [activeJD, candidates]);

  const clearCandidates = useCallback(() => {
    if (activeJD) {
      setCandidates(prev => prev.filter(c => c.jobDescriptionId !== activeJD.id));
    }
  }, [activeJD]);

  const getCandidateById = useCallback((id: string): Candidate | undefined => {
    return candidates.find(c => c.id === id);
  }, [candidates]);

  const refreshStats = useCallback(() => {
    const filteredCandidates = activeJD 
      ? candidates.filter(c => c.jobDescriptionId === activeJD.id)
      : candidates;
    setStats(calculateStats(filteredCandidates));
  }, [candidates, activeJD]);

  return (
    <FairHireContext.Provider
      value={{
        activeJD,
        jobDescriptions,
        createJobDescription,
        setActiveJD,
        candidates,
        addCandidate,
        addSampleCandidates,
        clearCandidates,
        getCandidateById,
        stats,
        refreshStats,
        statusFilter,
        setStatusFilter
      }}
    >
      {children}
    </FairHireContext.Provider>
  );
}

export function useFairHire() {
  const context = useContext(FairHireContext);
  if (context === undefined) {
    throw new Error("useFairHire must be used within a FairHireProvider");
  }
  return context;
}
