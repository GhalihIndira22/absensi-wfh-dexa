import { Request, Response } from 'express';

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
