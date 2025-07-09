import { Router } from 'express';
import { getProfile } from '../controllers/profile.controller';
import { verifyToken } from '../../auth/middlewares/verifyToken';

const router = Router();

router.get('/me', verifyToken, getProfile);

export default router;
