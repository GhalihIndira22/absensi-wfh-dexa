import { Router } from 'express';
import { getAllLogs } from '../controllers/log.controller';
import {verifyToken} from "../../auth/middlewares/verifyToken";
import {requireAdmin} from "../../auth/middlewares/requireAdmin";

const router = Router();

router.get('/logs', verifyToken, requireAdmin, getAllLogs);

export default router;
