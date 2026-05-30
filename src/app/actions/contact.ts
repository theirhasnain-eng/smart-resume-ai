'use server';

import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export async function contactFormAction(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const message = String(formData.get('message') ?? '').trim();

  if (!name || !email.includes('@') || !message) {
    redirect('/?contact=error#contact');
  }

  await prisma.contactMessage.create({ data: { name, email, message } });
  redirect('/?contact=ok#contact');
}
