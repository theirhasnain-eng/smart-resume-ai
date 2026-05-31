'use server';

import { prisma } from '@/lib/prisma';
import { getSession, requireRole } from '@/lib/auth';
import { extractTextFromBuffer } from '@/lib/extract-text';
import { matchJobToResumes } from '@/lib/matcher';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function uploadResumeAction(formData: FormData) {
  const user = requireRole(await getSession(), ['candidate']);

  const file = formData.get('resume') as File | null;
  if (!file || file.size === 0) redirect('/candidate/dashboard?error=file');

  const allowed = ['pdf', 'docx', 'txt'];
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  if (!allowed.includes(ext)) redirect('/candidate/dashboard?error=type');

  const buffer = Buffer.from(await file.arrayBuffer());
  let text = '';
  try {
    text = await extractTextFromBuffer(buffer, file.name);
  } catch (err) {
    const msg = err instanceof Error ? err.message.toLowerCase() : '';
    if (msg.includes('.doc')) redirect('/candidate/dashboard?error=doc');
    redirect('/candidate/dashboard?error=read');
  }

  if (!text.trim()) {
    redirect('/candidate/dashboard?error=empty');
  }

  await prisma.resume.create({
    data: {
      candidateId: user.id,
      originalName: file.name,
      extractedText: text,
    },
  });

  revalidatePath('/candidate/dashboard');
  redirect('/candidate/dashboard?success=upload');
}

export async function getCandidateMatches(userId: number) {
  // Fast path: use HR analysis results already stored in DB
  const stored = await prisma.match.findMany({
    where: { resume: { candidateId: userId } },
    include: { job: true },
    orderBy: { similarityScore: 'desc' },
    take: 50,
  });

  if (stored.length > 0) {
    const byJob = new Map<number, (typeof stored)[0]>();
    for (const m of stored) {
      const existing = byJob.get(m.jobId);
      if (!existing || Number(m.similarityScore) > Number(existing.similarityScore)) {
        byJob.set(m.jobId, m);
      }
    }
    const ranked = [...byJob.values()].sort(
      (a, b) => Number(b.similarityScore) - Number(a.similarityScore)
    );
    const jobs = ranked.map((m) => ({
      title: m.job.title,
      location: m.job.location,
      score: Number(m.similarityScore),
    }));
    const top = ranked[0];
    return {
      best: {
        title: top.job.title,
        location: top.job.location,
        score: Number(top.similarityScore),
        skillGap: top.skillGap ?? '',
      },
      jobs,
    };
  }

  // Fallback: live match (limited) before HR runs analyze
  const resumes = await prisma.resume.findMany({
    where: { candidateId: userId },
    select: { id: true, extractedText: true },
  });
  if (!resumes.length) return { best: null, jobs: [] as { title: string; location: string | null; score: number }[] };

  const jobs = await prisma.job.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    select: { title: true, location: true, description: true },
  });

  const results: { title: string; location: string | null; score: number }[] = [];
  let best: { title: string; location: string | null; score: number; skillGap: string } | null = null;

  const payload = resumes.map((r) => ({ id: r.id, text: r.extractedText ?? '' }));

  for (const job of jobs) {
    const matches = matchJobToResumes(job.description, payload);
    if (!matches.length) continue;
    const top = matches[0];
    results.push({ title: job.title, location: job.location, score: top.score });
    if (!best || top.score > best.score) {
      best = { title: job.title, location: job.location, score: top.score, skillGap: top.skillGap };
    }
  }

  results.sort((a, b) => b.score - a.score);
  return { best, jobs: results };
}
