import {PrismaClient} from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {LoginDto} from '../dto/login.dto';

const prisma = new PrismaClient();

export const findUserByEmail = async (email: string) => {
    return prisma.user.findUnique({
        where: {email}
    });
};

export const loginService = async (loginDto: LoginDto) => {
    console.log('[loginService] Input:', loginDto);
    const { email, password } = loginDto;
    const user = await findUserByEmail(email);
    if (!user) {
        console.error('[loginService] User not found:', email);
        const error: any = new Error('User not found');
        error.status = 401;
        throw error;
    }
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
        console.error('[loginService] Invalid password for:', email);
        const error: any = new Error('Invalid password');
        error.status = 401;
        throw error;
    }
    const token = jwt.sign(
        {id: user.id, email: user.email, role: user.role},
        process.env.JWT_SECRET!,
        {expiresIn: '1d'}
    );
    console.log('[loginService] Success, token generated for:', email);
    return token;
};

