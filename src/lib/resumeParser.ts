// Resume Parser Types
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

// Extract text from PDF using basic text extraction
async function extractTextFromPDF(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async function(event) {
      try {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        const bytes = new Uint8Array(arrayBuffer);
        
        // Convert to string for parsing
        const pdfString = new TextDecoder('latin1').decode(bytes);
        
        let text = '';
        
        // Extract text between BT and ET markers (text objects)
        const textMatches = pdfString.match(/BT[\s\S]*?ET/g) || [];
        
        for (const match of textMatches) {
          // Extract text from Tj operators
          const tjMatches = match.match(/\(([^)]*)\)\s*Tj/g) || [];
          for (const tj of tjMatches) {
            const content = tj.match(/\(([^)]*)\)/)?.[1] || '';
            text += content + ' ';
          }
          
          // Extract from TJ arrays
          const tjArrays = match.match(/\[(.*?)\]\s*TJ/g) || [];
          for (const arr of tjArrays) {
            const contents = arr.match(/\(([^)]*)\)/g) || [];
            for (const c of contents) {
              text += c.slice(1, -1) + ' ';
            }
          }
        }
        
        // Also find readable text patterns
        const readableText = pdfString.match(/[A-Za-z][A-Za-z\s,.@\-()0-9]{10,}/g) || [];
        const additionalText = readableText
          .filter(t => !t.includes('stream') && !t.includes('endobj') && !t.includes('xref'))
          .join(' ');
        
        text = text + ' ' + additionalText;
        
        // Clean up
        text = text
          .replace(/\\n/g, '\n')
          .replace(/\\r/g, '')
          .replace(/\s+/g, ' ')
          .trim();
        
        resolve(text);
      } catch (error) {
        reject(new Error('Failed to extract text from PDF'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

// Extract text from DOCX (ZIP with XML inside)
async function extractTextFromDOCX(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async function(event) {
      try {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        const bytes = new Uint8Array(arrayBuffer);
        const text = new TextDecoder('utf-8').decode(bytes);
        
        // DOCX files are ZIP files - extract text content from XML
        // Look for word/document.xml content
        const textMatches = text.match(/<w:t[^>]*>([^<]*)<\/w:t>/g) || [];
        let extractedText = textMatches
          .map(m => m.replace(/<[^>]+>/g, ''))
          .join(' ');
        
        if (extractedText.length < 50) {
          // Fallback: extract any readable text
          extractedText = text
            .replace(/<[^>]+>/g, ' ')
            .replace(/[^\x20-\x7E\n]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
        }
        
        resolve(extractedText);
      } catch (error) {
        reject(new Error('Failed to extract text from DOCX'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

// Parse name from resume text
function extractName(text: string): string {
  const lines = text.split(/[\n\r]+/).filter(l => l.trim().length > 0);
  
  for (const line of lines.slice(0, 8)) {
    const cleaned = line.trim();
    // Check for name pattern (2-4 words, mostly letters)
    if (/^[A-Z][a-z]+(\s+[A-Z][a-z]+){1,3}$/.test(cleaned) && cleaned.length < 40) {
      return cleaned;
    }
    // Look for "Name:" pattern
    const nameMatch = cleaned.match(/Name[:\s]+([A-Za-z\s]+)/i);
    if (nameMatch) return nameMatch[1].trim();
  }
  
  // Fallback: first reasonable line
  const firstLine = lines.find(l => {
    const t = l.trim();
    return t.length > 3 && t.length < 50 && /^[A-Za-z\s]+$/.test(t);
  });
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

// Extract skills
function extractSkills(text: string): string[] {
  const skills: Set<string> = new Set();
  
  const techSkills = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin', 'PHP',
    'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'Rails', 'Next.js',
    'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch', 'Firebase',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Jenkins', 'Git', 'CI/CD', 'Linux',
    'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'NLP', 'Computer Vision', 'AI',
    'HTML', 'CSS', 'SASS', 'Tailwind', 'Bootstrap', 'Figma',
    'REST', 'GraphQL', 'API', 'Microservices', 'WebSocket',
    'Agile', 'Scrum', 'JIRA', 'Confluence', 'Trello',
    'Excel', 'PowerPoint', 'Word', 'Tableau', 'Power BI', 'Data Analysis',
    'Communication', 'Leadership', 'Teamwork', 'Problem Solving', 'Critical Thinking',
    'Project Management', 'Time Management', 'Analytical Skills', 'Public Speaking',
  ];
  
  const skillSection = text.match(/(?:SKILLS|TECHNICAL SKILLS|KEY SKILLS|CORE COMPETENCIES)[:\s]*([\s\S]*?)(?=\n\s*(?:EDUCATION|EXPERIENCE|PROJECTS|WORK|CERTIFICATION|$))/i);
  const skillText = skillSection ? skillSection[1] : text;
  
  for (const skill of techSkills) {
    const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(skillText)) {
      skills.add(skill);
    }
  }
  
  return Array.from(skills).slice(0, 20);
}

// Extract education
function extractEducation(text: string): EducationEntry[] {
  const education: EducationEntry[] = [];
  
  const degreePatterns = [
    { pattern: /(?:Ph\.?D\.?|Doctorate)/i, name: 'Ph.D.' },
    { pattern: /(?:Master|M\.?S\.?|M\.?A\.?|M\.?E\.?|M\.?Tech|MBA)/i, name: 'Master\'s' },
    { pattern: /(?:Bachelor|B\.?S\.?|B\.?A\.?|B\.?E\.?|B\.?Tech)/i, name: 'Bachelor\'s' },
  ];
  
  for (const { pattern, name } of degreePatterns) {
    if (pattern.test(text)) {
      const yearMatch = text.match(/20\d{2}|19\d{2}/);
      const instMatch = text.match(/(?:University|College|Institute|School)[^,\n]*/i);
      
      education.push({
        institution: instMatch ? instMatch[0].trim() : 'Institution detected',
        degree: name,
        field: '',
        year: yearMatch ? yearMatch[0] : ''
      });
      break;
    }
  }
  
  return education;
}

// Extract experience
function extractExperience(text: string): ExperienceEntry[] {
  const experience: ExperienceEntry[] = [];
  
  const titlePatterns = ['Engineer', 'Developer', 'Manager', 'Analyst', 'Designer', 'Consultant', 'Lead', 'Director', 'Specialist', 'Intern'];
  
  for (const pattern of titlePatterns) {
    const regex = new RegExp(`[A-Za-z\\s]*${pattern}[A-Za-z\\s]*`, 'gi');
    const matches = text.match(regex) || [];
    
    for (const match of matches.slice(0, 2)) {
      if (match.length > 5 && match.length < 60) {
        experience.push({
          company: 'Company detected',
          title: match.trim(),
          duration: '',
          description: 'Experience details in resume'
        });
      }
    }
    if (experience.length > 0) break;
  }
  
  return experience.slice(0, 3);
}

// Extract projects
function extractProjects(text: string): ProjectEntry[] {
  const projSection = text.match(/(?:PROJECTS|PERSONAL PROJECTS)[:\s]*([\s\S]*?)(?=\n\s*(?:EDUCATION|EXPERIENCE|SKILLS|$))/i);
  if (!projSection) return [];
  
  return [{
    name: 'Projects detected',
    description: 'Project details in resume',
    technologies: []
  }];
}

// Extract languages
function extractLanguages(text: string): string[] {
  const languages: string[] = [];
  const commonLanguages = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Mandarin', 'Hindi', 'Arabic', 'Portuguese', 'Japanese', 'Korean', 'Russian', 'Italian'];
  
  for (const lang of commonLanguages) {
    if (new RegExp(`\\b${lang}\\b`, 'i').test(text)) {
      languages.push(lang);
    }
  }
  
  return languages;
}

// Calculate confidence
function calculateConfidence(parsed: Partial<ParsedResume>): number {
  let score = 0;
  if (parsed.candidateName && parsed.candidateName !== 'Unknown Candidate') score += 20;
  if (parsed.email) score += 15;
  if (parsed.phone) score += 10;
  if (parsed.education && parsed.education.length > 0) score += 15;
  if (parsed.skills && parsed.skills.length >= 3) score += 25;
  if (parsed.experience && parsed.experience.length > 0) score += 15;
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
      rawText = await file.text();
    }
  } catch (error) {
    console.error('Error extracting text:', error);
    throw new Error('Failed to parse resume. Please try a different file format.');
  }
  
  if (!rawText || rawText.trim().length < 20) {
    throw new Error('Could not extract text from resume. The file may be image-based.');
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
    summary: rawText.slice(0, 200),
    parseConfidence: 0
  };
  
  parsed.parseConfidence = calculateConfidence(parsed);
  
  return parsed;
}

// JD-Resume matching
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
    } else if (parsedResume.rawText.toLowerCase().includes(skillLower)) {
      partialMatches.push(skill);
    } else {
      missingSkills.push(skill);
    }
  }
  
  // Estimate experience years
  let experienceYears = Math.max(1, parsedResume.experience.length);
  
  let experienceMatch: "below" | "meets" | "exceeds" = "meets";
  if (experienceYears < jd.experienceRange.min) {
    experienceMatch = "below";
  } else if (experienceYears > jd.experienceRange.max) {
    experienceMatch = "exceeds";
  }
  
  // Calculate score
  const skillScore = jd.requiredSkills.length > 0 
    ? ((matchedSkills.length + partialMatches.length * 0.5) / jd.requiredSkills.length) * 60
    : 50;
  
  const expScore = experienceMatch === "meets" ? 25 : experienceMatch === "exceeds" ? 30 : 15;
  const eduScore = parsedResume.education.length > 0 ? 10 : 5;
  
  const overallScore = Math.min(100, Math.round(skillScore + expScore + eduScore));
  
  const strengthAreas: string[] = [];
  const improvementAreas: string[] = [];
  
  if (matchedSkills.length >= jd.requiredSkills.length * 0.5) {
    strengthAreas.push('Good skill alignment');
  }
  if (experienceMatch === "exceeds") {
    strengthAreas.push('Experience exceeds requirements');
  }
  
  if (missingSkills.length > 0) {
    improvementAreas.push(`Missing: ${missingSkills.slice(0, 3).join(', ')}`);
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
