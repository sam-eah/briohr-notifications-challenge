import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Company, NotificationChannel, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationFactory } from './notification-factory';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async createNotification(createNotificationDto: CreateNotificationDto) {
    const user = await this.prisma.user.findFirst({
      where: { id: createNotificationDto.userId },
    });
    if (!user)
      throw new HttpException('user not found', HttpStatus.BAD_REQUEST);

    const company = await this.prisma.company.findFirst({
      where: { id: createNotificationDto.companyId },
    });
    if (!company)
      throw new HttpException('company not found', HttpStatus.BAD_REQUEST);

    const notificationType = await this.prisma.notificationType.findFirst({
      where: { name: createNotificationDto.notificationTypeName },
    });
    if (!notificationType)
      throw new HttpException(
        'notification type not found',
        HttpStatus.BAD_REQUEST,
      );

    for (const notificationChannel of notificationType.notificationChannels) {
      const notification = new NotificationFactory().create(
        this.prisma,
        user,
        company,
        notificationChannel,
      );
      await notification.checkAndSend();
    }
  }

  async listUserUINotifications(id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id },
    });
    console.log(user);
    if (!user)
      throw new HttpException('user not found', HttpStatus.BAD_REQUEST);

    return await this.prisma.uiNotification.findMany({
      where: { userId: id },
    });
  }
}
