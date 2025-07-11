import { Router } from 'express';
import {absen, getAllAttendance} from '../controllers/attendance.controller';
import { verifyToken } from '../../auth/middlewares/verifyToken';
import { getSummary } from '../controllers/attendance.controller';
import {requireAdmin} from "../../auth/middlewares/requireAdmin";


const router = Router();

router.post('/absen', verifyToken, absen);
router.get('/summary', verifyToken, getSummary);
router.get('/attendances', verifyToken, requireAdmin, getAllAttendance);


export default router;
