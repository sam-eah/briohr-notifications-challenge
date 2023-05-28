import { Test } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationsModule } from '../notifications.module';
import { NotificationFactory } from '../notification-factory';
import { NotificationChannel } from '@prisma/client';

describe('NotificationsFactory', () => {
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [NotificationsModule],
    }).compile();
    prisma = moduleRef.get(PrismaService);
  });

  describe('create UI notification', () => {
    it('should create UI notification', async () => {
      const company = await prisma.company.findFirst({
        where: { companyName: 'BrioHR Both' },
      });
      const user = await prisma.user.findFirst({
        where: { firstName: 'User Both' },
      });

      const res = new NotificationFactory()
        .create(prisma, user, company, NotificationChannel.EMAIL)
        .check();

      expect(res).toBe(true);
    });
  });
});
