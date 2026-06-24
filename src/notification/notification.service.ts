import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { FcmChannel } from './channels/fcm.channel';
import { SendNotificationDto } from './dto/send-notification.dto';
import {
  NOTIFICATION_TEMPLATES,
  renderTemplate,
} from './templates/notification-templates';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(private readonly fcmChannel: FcmChannel) {}

  /**
   * Sends a structured notification by rendering the matching template and routing to FCM.
   */
  async sendNotification(dto: SendNotificationDto) {
    const template = NOTIFICATION_TEMPLATES[dto.type];
    if (!template) {
      throw new BadRequestException(
        `No template found for notification type: ${dto.type}`,
      );
    }

    const title = renderTemplate(template.title, dto.data ?? {});
    const body = renderTemplate(template.body, dto.data ?? {});

    this.logger.log(
      `Dispatching notification [${dto.type}] to recipient: ${dto.recipient}`,
    );

    return this.fcmChannel.send({
      recipient: dto.recipient,
      title,
      body,
      data: dto.data,
    });
  }

  /**
   * Sends a simple manual push notification.
   * @deprecated Use sendNotification instead.
   */
  async sendPush(token: string, title: string, body: string) {
    return this.fcmChannel.send({
      recipient: token,
      title,
      body,
    });
  }
}