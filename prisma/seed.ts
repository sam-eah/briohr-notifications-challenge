import { PrismaClient } from '@prisma/client';
import { seedCore } from './seed-core';

const prisma = new PrismaClient();

async function main() {
  await seedCore(prisma);

  const companyCount = await prisma.company.count();
  const userCount = await prisma.user.count();
  const notificationTypeCount = await prisma.notificationType.count();

  console.log(`created ${companyCount} companies`);
  console.log(`created ${userCount} users`);
  console.log(`created ${notificationTypeCount} notification types`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
