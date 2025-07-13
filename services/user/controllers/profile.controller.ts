import { Request, Response } from 'express';
import {findUserById, updateProfile} from '../services/profile.service';
import {publishProfileUpdate} from "../kafka/producer";

export const getProfile = async (req: Request, res: Response) => {
    const user = req.user;
    if (!user?.id) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const profile = await findUserById(user.id);
        if (!profile) return res.status(404).json({ error: 'User not found' });

        res.json(profile);
    } catch (err) {
        console.error('Error fetching profile:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateMyProfile = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const input = req.body;

    const { userBefore, changes } = await updateProfile(userId, input);

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
