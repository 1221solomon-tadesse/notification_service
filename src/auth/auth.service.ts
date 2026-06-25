import {
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../notification/types/notification-types';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly notificationService: NotificationService,
  ) {}

  /**
   * Registers a new user, hashes their password, saves them to the DB,
   * and fires a USER_REGISTRATION push notification if an FCM token was provided.
   */
  async register(dto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);

    // Will throw ConflictException if email already exists
    const user = await this.usersService.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      fcmToken: dto.fcmToken,
    });

    this.logger.log(`New user registered: ${user.email} (id=${user.id})`);

    // Fire push notification if the client sent a device token
    if (user.fcmToken) {
      try {
        await this.notificationService.sendNotification({
          recipient: user.fcmToken,
          type: NotificationType.USER_REGISTRATION,
          data: { name: user.name },
        });
        this.logger.log(
          `Welcome notification dispatched to user ${user.id} (token: ${user.fcmToken.slice(0, 20)}...)`,
        );
      } catch (err: any) {
        // Don't fail the registration if notification fails
        this.logger.warn(
          `Registration succeeded but notification failed: ${err.message}`,
        );
      }
    }

    return {
      success: true,
      userId: user.id,
      name: user.name,
      email: user.email,
      message: 'Registration successful! Check your device for a welcome notification.',
    };
  }

  /**
   * Validates credentials and returns user info.
   * Updates the FCM token if a new one is provided (e.g. user logged in on a new device).
   */
  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    // Update FCM token if a new device token was provided
    if (dto.fcmToken && dto.fcmToken !== user.fcmToken) {
      await this.usersService.updateFcmToken(user.id, dto.fcmToken);
      this.logger.log(`FCM token updated for user ${user.id}`);
    }

    this.logger.log(`User logged in: ${user.email} (id=${user.id})`);

    return {
      success: true,
      userId: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
