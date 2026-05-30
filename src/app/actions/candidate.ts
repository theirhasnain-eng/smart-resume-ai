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
  const resumes = await prisma.resume.findMany({ where: { candidateId: userId } });
  if (!resumes.length) return { best: null, jobs: [] as { title: string; location: string | null; score: number }[] };

  const jobs = await prisma.job.findMany();

  const results: { title: string; location: string | null; score: number }[] = [];
  let best: { title: string; location: string | null; score: number; skillGap: string } | null = null;

  for (const job of jobs) {
    const payload = resumes.map((r) => ({ id: r.id, text: r.extractedText ?? '' }));
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
