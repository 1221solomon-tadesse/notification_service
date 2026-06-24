import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { SendNotificationDto } from './dto/send-notification.dto';
import { NotificationType } from './types/notification-types';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('send')
  @HttpCode(HttpStatus.OK)
  async sendNotification(@Body() dto: SendNotificationDto) {
    if (!dto.recipient) {
      throw new BadRequestException('recipient is required');
    }
    if (!dto.type) {
      throw new BadRequestException('type is required');
    }
    if (!Object.values(NotificationType).includes(dto.type)) {
      throw new BadRequestException(
        `Invalid notification type. Supported types: ${Object.values(NotificationType).join(', ')}`,
      );
    }

    const result = await this.notificationService.sendNotification(dto);
    if (!result.success) {
      throw new BadRequestException(
        result.error || 'Failed to send notification',
      );
    }
    return result;
  }
}
