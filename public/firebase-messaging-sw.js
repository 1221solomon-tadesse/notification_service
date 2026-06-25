// Give the service worker access to Firebase Messaging.
// Note: We use the compat library version for straightforward Sw import scripts.
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

// Parse the Firebase config parameters passed via the registration URL query string.
const params = new URLSearchParams(self.location.search);
const apiKey = params.get('apiKey');
const authDomain = params.get('authDomain');
const projectId = params.get('projectId');
const storageBucket = params.get('storageBucket');
const messagingSenderId = params.get('messagingSenderId');
const appId = params.get('appId');

if (apiKey && messagingSenderId && projectId && appId) {
  // Initialize the Firebase app in the service worker
  firebase.initializeApp({
    apiKey,
    authDomain: authDomain || undefined,
    projectId,
    storageBucket: storageBucket || undefined,
    messagingSenderId,
    appId,
  });

  // Retrieve an instance of Firebase Messaging so that it can handle background messages
  const messaging = firebase.messaging();

  // Customize background notification handling
  messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message: ', payload);

    const notificationTitle = payload.notification?.title || 'Notification Received';
    const notificationOptions = {
      body: payload.notification?.body || '',
      icon: '/favicon.ico',
      data: payload.data || {},
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });
} else {
  console.warn('[firebase-messaging-sw.js] Firebase config parameters missing in URL query parameters. Background push notifications disabled.');
}
