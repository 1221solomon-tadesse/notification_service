export class RegisterDto {
  name: string;
  email: string;
  password: string;
  /** Optional FCM device token — if provided, a welcome push notification is sent immediately */
  fcmToken?: string;
}
