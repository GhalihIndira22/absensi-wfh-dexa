import {LogPayload} from "./types/log.types";
import {messaging} from "./firebase";

export const sendAdminNotification = async (log: LogPayload) => {
    const message = {
        notification: {
            title: 'Perubahan Profil Karyawan',
            body: `Karyawan dengan id ${log.employee_id} mengubah ${log.change_type}`,
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
