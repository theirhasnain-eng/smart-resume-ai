'use server';

import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { createSession } from '@/lib/auth';

export async function loginAction(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    redirect('/login?error=invalid');
  }

  await createSession({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });

  if (user.role === 'admin') redirect('/admin/dashboard');
  if (user.role === 'hr') redirect('/hr/dashboard');
  redirect('/candidate/dashboard');
}

export async function registerAction(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');
  const confirm = String(formData.get('confirm') ?? '');

  if (!name || !email || password.length < 6 || password !== confirm) {
    redirect('/register?error=fields');
  }

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) redirect('/register?error=exists');

  const hash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { name, email, passwordHash: hash, role: 'candidate' },
  });

  redirect('/login?registered=1');
}
