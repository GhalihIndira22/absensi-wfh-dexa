import { Router } from 'express';
import { absen } from '../controllers/attendance.controller';
import { verifyToken } from '../../auth/middlewares/verifyToken';
import { getSummary } from '../controllers/attendance.controller';


const router = Router();

router.post('/absen', verifyToken, absen);
router.get('/summary', verifyToken, getSummary);


export default router;
