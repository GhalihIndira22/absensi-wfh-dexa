import { Router } from 'express';
import {getProfile, updateMyProfile} from '../controllers/profile.controller';
import { verifyToken } from '../../auth/middlewares/verifyToken';
import { Request, Response } from 'express';
import multer from 'multer';
import path from "node:path";
import * as fs from "node:fs";

interface MulterRequest extends Request {
    file?: Express.Multer.File;
}

const router = Router();

const storage = multer.diskStorage({
    destination: (req: any, file: any, cb: (arg0: null, arg1: string) => void) => {
        const uploadPath = path.join(__dirname, '../../public/uploads');
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: (req: any, file: { originalname: string; }, cb: (arg0: null, arg1: string) => void) => {
        const ext = path.extname(file.originalname);
        const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        cb(null, filename);
    },
});

const upload = multer({ storage });

router.get('/me', verifyToken, getProfile);
router.put('/me', verifyToken, updateMyProfile);

router.post('/photo-upload', verifyToken, upload.single('file'), (req: Request, res: Response) => {
    const file = (req as MulterRequest).file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const url = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
    res.json({ url });
});

export default router;
