import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL ?? 'admin@smartresume.ai';
  const password = process.env.SEED_ADMIN_PASSWORD ?? 'Admin@123';
  const hash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      name: 'System Admin',
      email,
      passwordHash: hash,
      role: 'admin',
    },
  });

  console.log('Admin user:', email, '/', password);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
