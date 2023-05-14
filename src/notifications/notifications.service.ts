import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Company, NotificationChannel, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async createUiNotification(user: User, company: Company) {
    const res = await this.prisma.uiNotification.create({
      data: {
        userId: user.id,
        companyId: company.id,
        subject: `Happy Birthday ${user.firstName}`,
        content: `${company.companyName} is wishing you a happy birthday`,
      },
    });
    return res;
  }

  createEmailNotification(user: User) {
    console.log(`Happy Birthday ${user.firstName}`);
  }

  async createNotification(createNotificationDto: CreateNotificationDto) {
    const user = await this.prisma.user.findFirst({
      where: { id: createNotificationDto.userId },
    });
    console.log(user);
    if (!user)
      throw new HttpException('user not found', HttpStatus.BAD_REQUEST);

    const company = await this.prisma.company.findFirst({
      where: { id: createNotificationDto.companyId },
    });
    if (!user)
      throw new HttpException('company not found', HttpStatus.BAD_REQUEST);

    const notificationType = await this.prisma.notificationType.findFirst({
      where: { name: createNotificationDto.notificationTypeName },
    });
    if (!notificationType)
      throw new HttpException(
        'notification type not found',
        HttpStatus.BAD_REQUEST,
      );

    const notificationChannels = Object.keys(
      NotificationChannel,
    ) as NotificationChannel[];
    for (const notificationChannel of notificationChannels) {
      if (
        notificationType.notificationChannels.includes(notificationChannel) &&
        user.notificationChannels.includes(notificationChannel) &&
        company.notificationChannels.includes(notificationChannel)
      ) {
        switch (notificationChannel) {
          case NotificationChannel.EMAIL:
            this.createEmailNotification(user);
            break;
          case NotificationChannel.UI:
            await this.createUiNotification(user, company);
            break;

          default:
            break;
        }
      }
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
