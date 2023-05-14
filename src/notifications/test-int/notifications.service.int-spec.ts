import { Test } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationsService } from '../notifications.service';
import { NotificationsModule } from '../notifications.module';

import { PrismockClient } from 'prismock';
import { seedCore } from '../../../prisma/seed-core';

describe('NotificationsService', () => {
  let prisma: PrismaService;
  let service: NotificationsService;
  const prismock = new PrismockClient();

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [NotificationsModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismock)
      .compile();

    prisma = moduleRef.get(PrismaService);
    seedCore(prisma);
    service = moduleRef.get(NotificationsService);
  });

  describe('create UI notification', () => {
    it('should create UI notification', async () => {
      const company = await prisma.company.findFirst({
        where: { companyName: 'BrioHR Both' },
      });
      const user = await prisma.user.findFirst({
        where: { firstName: 'User Both' },
      });

      const prevCount = await prisma.uiNotification.count({
        where: { userId: user.id },
      });

      await service.createNotification({
        companyId: company.id,
        userId: user.id,
        notificationTypeName: 'leave_balance_reminder',
      });

      const currCount = await prisma.uiNotification.count({
        where: { userId: user.id },
      });

      expect(currCount).toBe(prevCount + 1);
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
