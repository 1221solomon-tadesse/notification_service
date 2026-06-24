import { NotificationType } from '../types/notification-types';

export class SendNotificationDto {
  recipient: string; // The FCM device token
  type: NotificationType;
  data: Record<string, string>; // Dynamic variables to populate the template
}
