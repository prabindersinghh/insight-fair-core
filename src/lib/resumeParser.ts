import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.js`;

export interface ParsedResume {
  rawText: string;
  candidateName: string;
  email: string;
  phone: string;
  education: EducationEntry[];
  skills: string[];
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  languages: string[];
  summary: string;
  parseConfidence: number;
}

export interface EducationEntry {
  institution: string;
  degree: string;
  field: string;
  year: string;
}

export interface ExperienceEntry {
  company: string;
  title: string;
  duration: string;
  description: string;
}

export interface ProjectEntry {
  name: string;
  description: string;
  technologies: string[];
}

// Extract text from PDF
async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ');
    fullText += pageText + '\n';
  }
  
  return fullText;
}

// Extract text from DOCX
async function extractTextFromDOCX(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

// Parse name from resume text
function extractName(text: string): string {
  const lines = text.split('\n').filter(l => l.trim().length > 0);
  // Usually the name is at the top, look for capitalized words
  for (const line of lines.slice(0, 5)) {
    const cleaned = line.trim();
    // Check if line looks like a name (2-4 capitalized words, no special chars)
    if (/^[A-Z][a-z]+(\s+[A-Z][a-z]+){1,3}$/.test(cleaned)) {
      return cleaned;
    }
    // Alternative: look for "Name:" pattern
    const nameMatch = cleaned.match(/Name[:\s]+([A-Za-z\s]+)/i);
    if (nameMatch) return nameMatch[1].trim();
  }
  // Fallback: first non-empty line that's not too long
  const firstLine = lines.find(l => l.trim().length > 2 && l.trim().length < 50);
  return firstLine?.trim() || 'Unknown Candidate';
}

// Extract email
function extractEmail(text: string): string {
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return emailMatch ? emailMatch[0] : '';
}

// Extract phone
function extractPhone(text: string): string {
  const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  return phoneMatch ? phoneMatch[0] : '';
}

// Extract education entries
function extractEducation(text: string): EducationEntry[] {
  const education: EducationEntry[] = [];
  const degreePatterns = [
    /(?:Bachelor|B\.?S\.?|B\.?A\.?|B\.?E\.?|B\.?Tech)/gi,
    /(?:Master|M\.?S\.?|M\.?A\.?|M\.?E\.?|M\.?Tech|MBA)/gi,
    /(?:Ph\.?D\.?|Doctorate)/gi,
  ];
  
  // Look for education section
  const eduSection = text.match(/(?:EDUCATION|ACADEMIC|QUALIFICATION)[S]?\s*[\n:]([\s\S]*?)(?=\n\s*(?:EXPERIENCE|SKILLS|PROJECTS|WORK|$))/i);
  const eduText = eduSection ? eduSection[1] : text;
  
  // Find degree mentions
  const lines = eduText.split('\n');
  let currentEntry: Partial<EducationEntry> = {};
  
  for (const line of lines) {
    const cleaned = line.trim();
    if (!cleaned) continue;
    
    // Check for degree
    for (const pattern of degreePatterns) {
      if (pattern.test(cleaned)) {
        if (currentEntry.degree) {
          education.push({
            institution: currentEntry.institution || 'Unknown Institution',
            degree: currentEntry.degree || '',
            field: currentEntry.field || '',
            year: currentEntry.year || ''
          });
          currentEntry = {};
        }
        currentEntry.degree = cleaned.match(pattern)?.[0] || '';
        
        // Try to extract field
        const fieldMatch = cleaned.match(/(?:in|of)\s+([A-Za-z\s]+)/i);
        if (fieldMatch) currentEntry.field = fieldMatch[1].trim();
        
        // Try to extract year
        const yearMatch = cleaned.match(/20\d{2}|19\d{2}/);
        if (yearMatch) currentEntry.year = yearMatch[0];
        break;
      }
    }
    
    // Check for university/college name
    if (/university|college|institute|school/i.test(cleaned) && !currentEntry.institution) {
      currentEntry.institution = cleaned.replace(/\d{4}/g, '').trim();
    }
  }
  
  if (currentEntry.degree) {
    education.push({
      institution: currentEntry.institution || 'Unknown Institution',
      degree: currentEntry.degree,
      field: currentEntry.field || '',
      year: currentEntry.year || ''
    });
  }
  
  // Fallback if no education found
  if (education.length === 0) {
    const hasDegree = /(?:bachelor|master|ph\.?d|b\.?s|m\.?s|mba)/i.test(text);
    if (hasDegree) {
      education.push({
        institution: 'Institution detected in resume',
        degree: text.match(/(?:Bachelor|Master|Ph\.?D|B\.?S|M\.?S|MBA)[^,\n]*/i)?.[0] || 'Degree',
        field: '',
        year: text.match(/20\d{2}/)?.[0] || ''
      });
    }
  }
  
  return education;
}

// Extract skills
function extractSkills(text: string): string[] {
  const skills: Set<string> = new Set();
  
  // Common tech skills to look for
  const techSkills = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin',
    'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'Rails',
    'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Jenkins', 'Git', 'CI/CD',
    'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'NLP', 'Computer Vision',
    'HTML', 'CSS', 'SASS', 'Tailwind', 'Bootstrap',
    'REST', 'GraphQL', 'API', 'Microservices',
    'Agile', 'Scrum', 'JIRA', 'Confluence',
    'Excel', 'PowerPoint', 'Word', 'Tableau', 'Power BI',
    'Communication', 'Leadership', 'Teamwork', 'Problem Solving', 'Critical Thinking',
    'Project Management', 'Time Management', 'Analytical Skills',
  ];
  
  // Look for skills section
  const skillSection = text.match(/(?:SKILLS|TECHNICAL SKILLS|KEY SKILLS|CORE COMPETENCIES)[:\s]*([\s\S]*?)(?=\n\s*(?:EDUCATION|EXPERIENCE|PROJECTS|WORK|CERTIFICATION|$))/i);
  const skillText = skillSection ? skillSection[1] : text;
  
  // Check for each skill
  for (const skill of techSkills) {
    const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(skillText)) {
      skills.add(skill);
    }
  }
  
  // Also extract comma/bullet separated items from skills section
  if (skillSection) {
    const items = skillSection[1].split(/[,•·|\n]+/).map(s => s.trim()).filter(s => s.length > 1 && s.length < 30);
    items.forEach(item => {
      if (!/^\d+$/.test(item)) skills.add(item);
    });
  }
  
  return Array.from(skills).slice(0, 20); // Limit to 20 skills
}

// Extract experience
function extractExperience(text: string): ExperienceEntry[] {
  const experience: ExperienceEntry[] = [];
  
  // Look for experience section
  const expSection = text.match(/(?:EXPERIENCE|WORK EXPERIENCE|PROFESSIONAL EXPERIENCE|EMPLOYMENT)[:\s]*([\s\S]*?)(?=\n\s*(?:EDUCATION|SKILLS|PROJECTS|CERTIFICATION|$))/i);
  const expText = expSection ? expSection[1] : '';
  
  if (!expText) {
    // Try to find company names and job titles
    const companyMatches = text.match(/(?:at|@)\s+([A-Z][a-zA-Z\s]+(?:Inc|Corp|LLC|Ltd|Company)?)/gi);
    if (companyMatches) {
      companyMatches.slice(0, 3).forEach(match => {
        experience.push({
          company: match.replace(/(?:at|@)\s+/i, '').trim(),
          title: 'Position detected',
          duration: '',
          description: 'Experience details in resume'
        });
      });
    }
    return experience;
  }
  
  // Split by potential job entries (look for date patterns or company names)
  const entries = expText.split(/(?=\n\s*(?:[A-Z][a-z]+\s+\d{4}|20\d{2}|19\d{2}))/);
  
  for (const entry of entries.slice(0, 5)) {
    const lines = entry.split('\n').filter(l => l.trim());
    if (lines.length === 0) continue;
    
    // Try to extract date range
    const dateMatch = entry.match(/(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*\d{4}\s*[-–to]+\s*(?:Present|Current|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*\d{4})/i);
    
    // Try to find job title
    const titlePatterns = ['Engineer', 'Developer', 'Manager', 'Analyst', 'Designer', 'Consultant', 'Lead', 'Director', 'Specialist', 'Coordinator', 'Intern'];
    let title = '';
    for (const pattern of titlePatterns) {
      const match = entry.match(new RegExp(`[A-Za-z\\s]*${pattern}[A-Za-z\\s]*`, 'i'));
      if (match) {
        title = match[0].trim();
        break;
      }
    }
    
    if (title || dateMatch) {
      experience.push({
        company: lines[0]?.trim().slice(0, 50) || 'Company',
        title: title || 'Position',
        duration: dateMatch ? dateMatch[0] : '',
        description: lines.slice(1).join(' ').slice(0, 200) || 'See resume for details'
      });
    }
  }
  
  return experience.slice(0, 5);
}

// Extract projects
function extractProjects(text: string): ProjectEntry[] {
  const projects: ProjectEntry[] = [];
  
  // Look for projects section
  const projSection = text.match(/(?:PROJECTS|PERSONAL PROJECTS|KEY PROJECTS|NOTABLE PROJECTS)[:\s]*([\s\S]*?)(?=\n\s*(?:EDUCATION|EXPERIENCE|SKILLS|CERTIFICATION|$))/i);
  
  if (!projSection) return projects;
  
  const projText = projSection[1];
  const entries = projText.split(/(?=\n\s*[A-Z])/);
  
  for (const entry of entries.slice(0, 5)) {
    const lines = entry.split('\n').filter(l => l.trim());
    if (lines.length === 0 || lines[0].length < 3) continue;
    
    projects.push({
      name: lines[0].trim().slice(0, 50),
      description: lines.slice(1).join(' ').slice(0, 150) || 'Project details in resume',
      technologies: extractSkills(entry).slice(0, 5)
    });
  }
  
  return projects.slice(0, 4);
}

// Extract languages
function extractLanguages(text: string): string[] {
  const languages: string[] = [];
  const commonLanguages = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Mandarin', 'Hindi', 'Arabic', 'Portuguese', 'Japanese', 'Korean', 'Russian', 'Italian'];
  
  // Look for languages section
  const langSection = text.match(/(?:LANGUAGES?|LANGUAGE SKILLS)[:\s]*([\s\S]*?)(?=\n\s*(?:EDUCATION|EXPERIENCE|SKILLS|PROJECTS|$))/i);
  const langText = langSection ? langSection[1] : text;
  
  for (const lang of commonLanguages) {
    if (new RegExp(`\\b${lang}\\b`, 'i').test(langText)) {
      languages.push(lang);
    }
  }
  
  return languages;
}

// Extract summary/objective
function extractSummary(text: string): string {
  const summarySection = text.match(/(?:SUMMARY|OBJECTIVE|PROFILE|ABOUT)[:\s]*([\s\S]*?)(?=\n\s*(?:EDUCATION|EXPERIENCE|SKILLS|PROJECTS|$))/i);
  
  if (summarySection) {
    return summarySection[1].trim().slice(0, 300);
  }
  
  // Return first few sentences if no summary section
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
  return sentences.slice(0, 2).join('. ').slice(0, 300);
}

// Calculate parse confidence
function calculateConfidence(parsed: Partial<ParsedResume>): number {
  let score = 0;
  
  if (parsed.candidateName && parsed.candidateName !== 'Unknown Candidate') score += 20;
  if (parsed.email) score += 15;
  if (parsed.phone) score += 10;
  if (parsed.education && parsed.education.length > 0) score += 15;
  if (parsed.skills && parsed.skills.length >= 3) score += 20;
  if (parsed.experience && parsed.experience.length > 0) score += 15;
  if (parsed.projects && parsed.projects.length > 0) score += 5;
  
  return Math.min(100, score);
}

// Main parsing function
export async function parseResume(file: File): Promise<ParsedResume> {
  const fileName = file.name.toLowerCase();
  let rawText = '';
  
  try {
    if (fileName.endsWith('.pdf')) {
      rawText = await extractTextFromPDF(file);
    } else if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
      rawText = await extractTextFromDOCX(file);
    } else {
      // Try to read as text
      rawText = await file.text();
    }
  } catch (error) {
    console.error('Error extracting text:', error);
    throw new Error('Failed to parse resume file. Please ensure it is a valid PDF or DOCX.');
  }
  
  if (!rawText || rawText.trim().length < 50) {
    throw new Error('Could not extract text from resume. The file may be image-based or corrupted.');
  }
  
  const parsed: ParsedResume = {
    rawText,
    candidateName: extractName(rawText),
    email: extractEmail(rawText),
    phone: extractPhone(rawText),
    education: extractEducation(rawText),
    skills: extractSkills(rawText),
    experience: extractExperience(rawText),
    projects: extractProjects(rawText),
    languages: extractLanguages(rawText),
    summary: extractSummary(rawText),
    parseConfidence: 0
  };
  
  parsed.parseConfidence = calculateConfidence(parsed);
  
  return parsed;
}

// JD-Resume matching
export interface JDMatchResult {
  overallScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  partialMatches: string[];
  experienceMatch: "below" | "meets" | "exceeds";
  experienceYears: number;
  strengthAreas: string[];
  improvementAreas: string[];
}

export function matchResumeToJD(
  parsedResume: ParsedResume, 
  jd: { requiredSkills: string[]; experienceRange: { min: number; max: number } }
): JDMatchResult {
  const resumeSkillsLower = parsedResume.skills.map(s => s.toLowerCase());
  
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];
  const partialMatches: string[] = [];
  
  for (const skill of jd.requiredSkills) {
    const skillLower = skill.toLowerCase();
    
    if (resumeSkillsLower.some(rs => rs === skillLower || rs.includes(skillLower) || skillLower.includes(rs))) {
      matchedSkills.push(skill);
    } else if (resumeSkillsLower.some(rs => 
      (rs.includes(skillLower.split(' ')[0]) || skillLower.split(' ')[0].includes(rs)) ||
      parsedResume.rawText.toLowerCase().includes(skillLower)
    )) {
      partialMatches.push(skill);
    } else {
      missingSkills.push(skill);
    }
  }
  
  // Estimate experience years
  let experienceYears = 0;
  for (const exp of parsedResume.experience) {
    const yearMatch = exp.duration.match(/(\d+)\s*(?:year|yr)/i);
    if (yearMatch) {
      experienceYears += parseInt(yearMatch[1]);
    } else if (exp.duration.includes('-') || exp.duration.toLowerCase().includes('to')) {
      experienceYears += 2; // Estimate 2 years per job
    }
  }
  experienceYears = Math.max(parsedResume.experience.length, experienceYears);
  
  // Experience match
  let experienceMatch: "below" | "meets" | "exceeds" = "meets";
  if (experienceYears < jd.experienceRange.min) {
    experienceMatch = "below";
  } else if (experienceYears > jd.experienceRange.max) {
    experienceMatch = "exceeds";
  }
  
  // Calculate overall score
  const skillScore = jd.requiredSkills.length > 0 
    ? ((matchedSkills.length + partialMatches.length * 0.5) / jd.requiredSkills.length) * 60
    : 50;
  
  const expScore = experienceMatch === "meets" ? 25 : experienceMatch === "exceeds" ? 30 : 15;
  const eduScore = parsedResume.education.length > 0 ? 10 : 5;
  
  const overallScore = Math.min(100, Math.round(skillScore + expScore + eduScore));
  
  // Identify strengths and improvements
  const strengthAreas: string[] = [];
  const improvementAreas: string[] = [];
  
  if (matchedSkills.length >= jd.requiredSkills.length * 0.7) {
    strengthAreas.push('Strong skill alignment with job requirements');
  }
  if (experienceMatch === "exceeds") {
    strengthAreas.push('Experience exceeds requirements');
  }
  if (parsedResume.projects.length > 0) {
    strengthAreas.push('Demonstrates hands-on project experience');
  }
  if (parsedResume.education.some(e => /master|ph\.?d/i.test(e.degree))) {
    strengthAreas.push('Advanced academic credentials');
  }
  
  if (missingSkills.length > 0) {
    improvementAreas.push(`Missing skills: ${missingSkills.slice(0, 3).join(', ')}`);
  }
  if (experienceMatch === "below") {
    improvementAreas.push(`Experience below minimum requirement (${jd.experienceRange.min} years)`);
  }
  
  return {
    overallScore,
    matchedSkills,
    missingSkills,
    partialMatches,
    experienceMatch,
    experienceYears,
    strengthAreas,
    improvementAreas
  };
}
