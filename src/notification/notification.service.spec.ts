import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { FcmChannel } from './channels/fcm.channel';
import { NotificationType } from './types/notification-types';

describe('NotificationService', () => {
  let service: NotificationService;
  let mockFcmChannel: jest.Mocked<Partial<FcmChannel>>;

  beforeEach(async () => {
    mockFcmChannel = {
      send: jest.fn().mockResolvedValue({ success: true, messageId: 'test-id' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: FcmChannel,
          useValue: mockFcmChannel,
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendNotification', () => {
    it('should correctly render and dispatch USER_REGISTRATION notification', async () => {
      const dto = {
        recipient: 'test-token',
        type: NotificationType.USER_REGISTRATION,
        data: { name: 'Alice' },
      };

      const result = await service.sendNotification(dto);

      expect(result.success).toBe(true);
      expect(result.messageId).toBe('test-id');
      expect(mockFcmChannel.send).toHaveBeenCalledWith({
        recipient: 'test-token',
        title: 'Welcome to our platform, Alice!',
        body: 'Hi Alice, your registration was successful. Welcome onboard!',
        data: { name: 'Alice' },
      });
    });

    it('should correctly render and dispatch PAYMENT_SUCCESS notification', async () => {
      const dto = {
        recipient: 'test-token',
        type: NotificationType.PAYMENT_SUCCESS,
        data: { amount: '100', currency: 'USD', transactionId: 'TXN123' },
      };

      await service.sendNotification(dto);

      expect(mockFcmChannel.send).toHaveBeenCalledWith({
        recipient: 'test-token',
        title: 'Payment Successful',
        body: 'Your payment of 100 USD was successfully processed. Transaction ID: TXN123.',
        data: dto.data,
      });
    });
  });
});
