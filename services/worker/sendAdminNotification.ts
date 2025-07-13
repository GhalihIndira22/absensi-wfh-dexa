import {LogPayload} from "./types/log.types";
import {messaging} from "./firebase";

export const sendAdminNotification = async (log: LogPayload) => {
    const message = {
        notification: {
            title: 'Perubahan Profil Karyawan',
            body: `${log.email} mengubah ${log.field}`,
        },
        topic: 'admin-notif',
    };

    try {
        const response = await messaging.send(message);
        console.log('✅ Notifikasi dikirim ke topic:', response);
    } catch (err) {
        console.error('❌ Gagal kirim notifikasi ke topic:', err);
    }
};
