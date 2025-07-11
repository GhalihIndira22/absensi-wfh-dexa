import { Request, Response } from 'express';
import { updateProfile } from '../services/profile.service';
import {publishProfileUpdate} from "../kafka/producer";

export const getProfile = async (req: Request, res: Response) => {
    // Ambil user dari JWT yang didekode di middleware
    const user = req.user;

    // TODO: Ambil data lengkap dari database berdasarkan user.id
    const mockProfile = {
        id: user?.id,
        name: 'John Doe',
        email: user?.email,
        position: 'Software Engineer',
        photo_url: 'https://i.pravatar.cc/300',
        phone_number: '081234567890'
    };

    res.json(mockProfile);
};

export const updateMyProfile = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const input = req.body;

    const { userBefore, changes } = await updateProfile(userId, input);

    // Kirim event ke Kafka
    for (const change of changes) {
        await publishProfileUpdate({
            employee_id: userId,
            change_type: change.type,
            old_value: (userBefore as any)?.[change.type] || '',
            new_value: change.newValue,
            changed_at: new Date().toISOString()
        });
    }

    res.json({ message: 'Profile updated' });
};
