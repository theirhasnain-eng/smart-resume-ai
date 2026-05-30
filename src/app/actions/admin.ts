'use server';

import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { getSession, requireRole } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createHrAction(formData: FormData) {
  requireRole(await getSession(), ['admin']);

  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');

  if (!name || !email.includes('@') || password.length < 6) {
    redirect('/admin/dashboard?error=hr-fields');
  }

  const exists = await prisma.user.findFirst({ where: { email: { equals: email, mode: 'insensitive' } } });
  if (exists) redirect('/admin/dashboard?error=hr-exists');

  const hash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { name, email, passwordHash: hash, role: 'hr' },
  });

  revalidatePath('/admin/dashboard');
  redirect('/admin/dashboard?success=hr');
}
