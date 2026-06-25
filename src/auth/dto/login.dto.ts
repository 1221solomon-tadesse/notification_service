export class LoginDto {
  email: string;
  password: string;
  /** Optional FCM device token — updates the stored token on successful login */
  fcmToken?: string;
}
