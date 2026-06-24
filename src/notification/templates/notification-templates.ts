import { NotificationType } from '../types/notification-types';

export interface Template {
  title: string;
  body: string;
}

export const NOTIFICATION_TEMPLATES: Record<NotificationType, Template> = {
  [NotificationType.USER_REGISTRATION]: {
    title: 'Welcome to our platform, {name}!',
    body: 'Hi {name}, your registration was successful. Welcome onboard!',
  },
  [NotificationType.PAYMENT_SUCCESS]: {
    title: 'Payment Successful',
    body: 'Your payment of {amount} {currency} was successfully processed. Transaction ID: {transactionId}.',
  },
  [NotificationType.NEW_MESSAGE]: {
    title: 'New Message from {senderName}',
    body: '{messageSnippet}',
  },
  [NotificationType.SECURITY_ALERT]: {
    title: 'Security Alert: New Login Detected',
    body: 'A new login was detected on your account from device: {device} at {time}. If this was not you, please secure your account immediately.',
  },
  [NotificationType.ORDER_UPDATE]: {
    title: 'Order #{orderId} Status Update',
    body: 'Your order #{orderId} status has been updated to: {status}. Thank you for shopping with us!',
  },
};

/**
 * Renders a template string by replacing placeholders like `{varName}` with values from variables.
 */
export function renderTemplate(
  templateStr: string,
  variables: Record<string, string>,
): string {
  return templateStr.replace(/\{(\w+)\}/g, (match, key) => {
    return variables[key] !== undefined ? variables[key] : match;
  });
}
