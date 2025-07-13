// services/admin/routes/fcm.route.ts
import { Router } from 'express';
import { messaging } from '../../worker/firebase';

const router = Router();

router.post('/admin/fcm/subscribe', async (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: 'FCM token is required' });

    try {
        const response = await messaging.subscribeToTopic([token], 'admin-notif');
        console.log('✅ Token subscribed to topic:', response);
        res.json({ success: true });
    } catch (err) {
        console.error('❌ Failed to subscribe token to topic:', err);
        res.status(500).json({ error: 'Subscription failed' });
    }
});

export default router;
