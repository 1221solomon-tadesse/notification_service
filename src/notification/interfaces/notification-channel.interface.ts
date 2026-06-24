export interface NotificationPayload {
  recipient: string; // FCM token, email, phone number, etc.
  title: string;
  body: string;
  data?: Record<string, string>;
}

export interface NotificationChannel {
  send(payload: NotificationPayload): Promise<{ success: boolean; messageId?: string; error?: string }>;
}
