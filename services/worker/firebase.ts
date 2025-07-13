// services/worker/firebase.ts
import admin from 'firebase-admin';
import path from 'path';

const serviceAccount = require(path.join(__dirname, '../../notif.json'));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

export const messaging = admin.messaging();
