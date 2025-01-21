importScripts(
  'https://www.gstatic.com/firebasejs/10.13.1/firebase-app-compat.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/10.13.1/firebase-messaging-compat.js'
);

const firebaseConfig = {
  apiKey: 'AIzaSyAHmRKDRPukXEJ7kfix24g6IVuY-Rek7J4',
  authDomain: 'in-game-push.firebaseapp.com',
  projectId: 'in-game-push',
  storageBucket: 'in-game-push.appspot.com',
  messagingSenderId: '1094416420054',
  appId: '1:1094416420054:web:c08c9c2b7411408ed20d77',
  measurementId: 'G-P0XB20ZVNE',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('===> Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png', // Replace with your own icon
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
