import { messaging } from './firebase';

export const sendTestNotificationToTopic = async () => {
    try {
        const res = await messaging.send({
            notification: {
                title: 'Tes Notifikasi',
                body: 'Notifikasi ini dikirim dari worker secara manual',
            },
            topic: 'admin-notif',
        });

        console.log('✅ Notifikasi manual dikirim ke topic admin-notif:', res);
    } catch (err) {
        console.error('❌ Gagal kirim notifikasi ke topic:', err);
    }
};
