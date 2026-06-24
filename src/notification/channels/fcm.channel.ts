import { Injectable, Logger } from '@nestjs/common';
import { getFirebaseApp } from '../firebase.config';
import { NotificationChannel, NotificationPayload } from '../interfaces/notification-channel.interface';

@Injectable()
export class FcmChannel implements NotificationChannel {
  private readonly logger = new Logger(FcmChannel.name);
  private messaging: any = null;

  constructor() {
    const app = getFirebaseApp();
    if (app) {
      this.messaging = app.messaging();
    } else {
      this.logger.warn(
        'Firebase App is not initialized. FcmChannel will run in Dry-Run mode.',
      );
    }
  }

  async send(
    payload: NotificationPayload,
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const { recipient, title, body, data } = payload;

    if (!this.messaging) {
      this.logger.log(
        `[Dry-Run Push Notification]
To: ${recipient}
Title: "${title}"
Body: "${body}"
Data: ${JSON.stringify(data ?? {})}`,
      );
      return { success: true, messageId: `dry-run-${Date.now()}` };
    }

    try {
      const messageId = await this.messaging.send({
        token: recipient,
        notification: {
          title,
          body,
        },
        data: data ?? {},
      });
      return { success: true, messageId };
    } catch (error: any) {
      this.logger.error(
        `Failed to send FCM push notification to ${recipient}: ${error.message}`,
        error.stack,
      );
      return { success: false, error: error.message };
    }
  }
}
