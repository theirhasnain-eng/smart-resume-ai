'use server';

import { prisma } from '@/lib/prisma';
import { getSession, requireRole } from '@/lib/auth';
import { matchJobToResumes } from '@/lib/matcher';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createJobAction(formData: FormData) {
  const user = requireRole(await getSession(), ['hr']);

  const title = String(formData.get('title') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim();
  const location = String(formData.get('location') ?? '').trim();

  if (!title || !description) redirect('/hr/dashboard?error=job');

  await prisma.job.create({
    data: { hrId: user.id, title, description, location: location || null },
  });

  revalidatePath('/hr/dashboard');
  redirect('/hr/dashboard?success=job');
}

export async function analyzeJobAction(formData: FormData) {
  const user = requireRole(await getSession(), ['hr']);

  const jobId = Number(formData.get('jobId'));
  if (!jobId || Number.isNaN(jobId)) {
    redirect('/hr/dashboard?error=notfound');
  }

  const job = await prisma.job.findFirst({ where: { id: jobId, hrId: user.id } });
  if (!job) redirect('/hr/dashboard?error=notfound');

  const resumes = await prisma.resume.findMany({
    include: { candidate: true },
    orderBy: { uploadedAt: 'desc' },
  });

  if (!resumes.length) {
    redirect(`/hr/analyze/${jobId}?error=noresumes`);
  }

  const payload = resumes.map((r) => ({
    id: r.id,
    text: r.extractedText?.trim() ?? '',
  }));

  const matches = matchJobToResumes(job.description, payload);

  await prisma.match.deleteMany({ where: { jobId: job.id } });

  if (matches.length > 0) {
    await prisma.match.createMany({
      data: matches.map((m) => ({
        jobId: job.id,
        resumeId: m.resumeId,
        similarityScore: m.score,
        skillGap: m.skillGap || null,
      })),
    });
  }

  revalidatePath(`/hr/analyze/${jobId}`);
  redirect(`/hr/analyze/${jobId}?done=1&count=${matches.length}`);
}
