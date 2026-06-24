import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { FcmChannel } from './channels/fcm.channel';
import { NotificationController } from './notification.controller';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService, FcmChannel],
  exports: [NotificationService],
})
export class NotificationModule {}