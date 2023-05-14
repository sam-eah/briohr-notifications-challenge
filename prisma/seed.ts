import { NotificationChannel, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.company.createMany({
    data: [
      {
        companyName: 'BrioHR Email',
        notificationChannels: [NotificationChannel.EMAIL],
      },
      {
        companyName: 'BrioHR UI',
        notificationChannels: [NotificationChannel.UI],
      },
      {
        companyName: 'BrioHR Both',
        notificationChannels: [
          NotificationChannel.EMAIL,
          NotificationChannel.UI,
        ],
      },
    ],
  });

  await prisma.user.createMany({
    data: [
      {
        firstName: 'User Email',
        notificationChannels: [NotificationChannel.EMAIL],
      },
      {
        firstName: 'User UI',
        notificationChannels: [NotificationChannel.UI],
      },
      {
        firstName: 'User Both',
        notificationChannels: [
          NotificationChannel.EMAIL,
          NotificationChannel.UI,
        ],
      },
    ],
  });

  await prisma.notificationType.createMany({
    data: [
      {
        name: 'leave_balance_reminder',
        notificationChannels: [NotificationChannel.UI],
      },
      {
        name: 'monthly_payslip',
        notificationChannels: [NotificationChannel.EMAIL],
      },
      {
        name: 'happy_birthday',
        notificationChannels: [
          NotificationChannel.EMAIL,
          NotificationChannel.UI,
        ],
      },
    ],
  });

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
