import { NotificationChannel, PrismaClient } from '@prisma/client';

export async function seedCore(prisma: PrismaClient) {
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
}
