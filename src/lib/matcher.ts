/**
 * TF-IDF-style matching in TypeScript (runs on Vercel serverless, no Python).
 */

function tokenize(text: string): string[] {
  const tokens: string[] = [];
  let current = '';
  const lower = text.toLowerCase();
  for (const ch of lower) {
    if (/[a-z0-9]/.test(ch)) {
      current += ch;
    } else if (current) {
      tokens.push(current);
      current = '';
    }
  }
  if (current) tokens.push(current);
  return tokens;
}

function termFreq(tokens: string[]): Map<string, number> {
  const m = new Map<string, number>();
  for (const t of tokens) {
    m.set(t, (m.get(t) ?? 0) + 1);
  }
  return m;
}

export type MatchResult = {
  resumeId: number;
  score: number;
  skillGap: string;
};

export function matchJobToResumes(
  jobDescription: string,
  resumes: { id: number; text: string }[]
): MatchResult[] {
  if (!resumes.length) return [];

  const jobTokens = tokenize(jobDescription);
  const jobCounts = termFreq(jobTokens.length ? jobTokens : ['job', 'skills', 'experience']);
  const jobVocab = new Set(jobCounts.keys());
  const results: MatchResult[] = [];

  for (const resume of resumes) {
    const resumeTokens = tokenize(resume.text);
    const resumeCounts = termFreq(resumeTokens);

    let score = 0;
    const gapTerms: string[] = [];

    if (resumeTokens.length) {
      const common = Array.from(jobVocab).filter((t) => resumeCounts.has(t));
      if (common.length) {
        const commonWeight = common.reduce(
          (sum, t) => sum + Math.min(jobCounts.get(t) ?? 0, resumeCounts.get(t) ?? 0),
          0
        );
        const totalWeight = Array.from(jobCounts.values()).reduce((a, b) => a + b, 0) || 1;
        score = (commonWeight / totalWeight) * 100;
      }

      for (const [term, jobCount] of Array.from(jobCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 25)) {
        if ((resumeCounts.get(term) ?? 0) < jobCount * 0.2) {
          gapTerms.push(term);
        }
        if (gapTerms.length >= 10) break;
      }
    } else {
      gapTerms.push(...Array.from(jobCounts.keys()).slice(0, 10));
    }

    results.push({
      resumeId: resume.id,
      score: Math.round(score * 100) / 100,
      skillGap: gapTerms.join(', '),
    });
  }

  return results.sort((a, b) => b.score - a.score);
}

export function scoreBarClass(score: number): string {
  if (score >= 90) return 'score-fill--excellent';
  if (score >= 70) return 'score-fill--good';
  if (score >= 50) return 'score-fill--fair';
  return 'score-fill--weak';
}
