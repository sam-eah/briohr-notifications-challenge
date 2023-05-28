import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Company, NotificationChannel, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

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

    const notificationChannels = Object.keys(
      NotificationChannel,
    ) as NotificationChannel[];

    for (const notificationChannel of notificationChannels) {
      const notification = new NotificationFactory().create(
        this.prisma,
        user,
        company,
        notificationChannel,
      );
      await notification.send();
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

interface INotification {
  prisma: PrismaService;
  user: User;
  company: Company;
  notificationChannel: NotificationChannel;

  /** checks if notification should be sent */
  check(): boolean;

  /** checks if notification should be sent and sends it */
  send(): Promise<void>;
}

abstract class AbstractNotification {
  prisma: PrismaService;
  user: User;
  company: Company;
  notificationChannel: NotificationChannel;

  constructor(prisma: PrismaService, user: User, company: Company) {
    this.prisma = prisma;
    this.user = user;
    this.company = company;
  }

  check() {
    return (
      this.user.notificationChannels.includes(this.notificationChannel) &&
      this.company.notificationChannels.includes(this.notificationChannel)
    );
  }
}

class NotificationFactory {
  create(
    prisma: PrismaService,
    user: User,
    company: Company,
    notificationChannel: NotificationChannel,
  ) {
    switch (notificationChannel) {
      case NotificationChannel.EMAIL:
        return new EmailNotification(prisma, user, company);
      case NotificationChannel.UI:
        return new UiNotification(prisma, user, company);
    }
  }
}

class UiNotification extends AbstractNotification implements INotification {
  notificationChannel = NotificationChannel.UI;

  async send() {
    if (!this.check()) return;

    const res = await this.prisma.uiNotification.create({
      data: {
        userId: this.user.id,
        companyId: this.company.id,
        subject: `Happy Birthday ${this.user.firstName}`,
        content: `${this.company.companyName} is wishing you a happy birthday`,
      },
    });
    return;
  }
}

class EmailNotification extends AbstractNotification implements INotification {
  notificationChannel = NotificationChannel.EMAIL;

  async send() {
    if (!this.check()) return;

    console.log(`Happy Birthday ${this.user.firstName}`);
  }
}
