import { Router } from 'express';
import { getAllLogs } from '../controllers/log.controller';

const router = Router();

router.get('/logs', getAllLogs);

export default router;
