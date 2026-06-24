import { initializeApp, cert, App } from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

let firebaseApp: App | null = null;
let isInitialized = false;

export function getFirebaseApp(): App | null {
  if (!isInitialized) {
    const configPath = join(process.cwd(), 'firebase-service-account.json');
    if (!existsSync(configPath)) {
      console.warn(
        '⚠️ firebase-service-account.json not found in root directory. Running Firebase Admin SDK in dry-run/sandbox mode.',
      );
      firebaseApp = null;
    } else {
      try {
        const serviceAccount = JSON.parse(readFileSync(configPath, 'utf8'));
        firebaseApp = initializeApp({
          credential: cert(serviceAccount),
        });
      } catch (error) {
        console.error('Failed to initialize Firebase Admin SDK:', error);
        firebaseApp = null;
      }
    }
    isInitialized = true;
  }

  return firebaseApp;
}