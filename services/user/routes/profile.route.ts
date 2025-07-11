import { Router } from 'express';
import {getProfile, updateMyProfile} from '../controllers/profile.controller';
import { verifyToken } from '../../auth/middlewares/verifyToken';

const router = Router();

router.get('/me', verifyToken, getProfile);
router.put('/me', verifyToken, updateMyProfile);

export default router;
