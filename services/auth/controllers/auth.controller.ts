import { Request, Response } from 'express';
import { LoginDto } from '../dto/login.dto';
import { loginService } from '../services/auth.service';

export const login = async (req: Request, res: Response) => {
    console.log('[login] Request:', req.body);
    const loginDto: LoginDto = req.body;
    try {
        const token = await loginService(loginDto);
        console.log('[login] Success:', { email: loginDto.email });
        res.json({ token });
    } catch (error: any) {
        console.error('[login] Error:', error.message);
        res.status(error.status || 401).json({ message: error.message });
    }
};
