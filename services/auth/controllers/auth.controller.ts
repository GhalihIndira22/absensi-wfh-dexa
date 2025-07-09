import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const mockUser = {
    id: 1,
    email: 'employee@company.com',
    passwordHash: bcrypt.hashSync('password123', 10), // Simulasi dari DB
    role: 'employee'
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Simulasi user DB lookup
    if (email !== mockUser.email) {
        return res.status(401).json({ message: 'User not found' });
    }

    const isValid = await bcrypt.compare(password, mockUser.passwordHash);
    if (!isValid) {
        return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
        { id: mockUser.id, email: mockUser.email, role: mockUser.role },
        process.env.JWT_SECRET!,
        { expiresIn: '1d' }
    );

    res.json({ token });
};
