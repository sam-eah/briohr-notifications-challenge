import { Company, NotificationChannel, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

interface INotification {
  prisma: PrismaService;
  user: User;
  company: Company;
  notificationChannel: NotificationChannel;

  /** checks if notification should be sent */
  check(): boolean;

  /** sends notifiaction */
  send(): Promise<void>;

  /** checks if notification should be sent and sends it if it should */
  checkAndSend(): Promise<void>;
}

abstract class AbstractNotification implements INotification {
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

  async send() {}

  async checkAndSend() {
    if (!this.check()) return;

    await this.send();
  }
}

class UiNotification extends AbstractNotification {
  notificationChannel = NotificationChannel.UI;

  async send() {
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

class EmailNotification extends AbstractNotification {
  notificationChannel = NotificationChannel.EMAIL;

  async send() {
    console.log(`Happy Birthday ${this.user.firstName}`);
  }
}

/** Notification Factory */
export class NotificationFactory {
  /** returns a new notification object */
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
