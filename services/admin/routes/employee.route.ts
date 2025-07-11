import { Router } from 'express';
import {createEmployee, deleteEmployee, getAllEmployees, updateEmployee} from '../controllers/employee.controller';
import { verifyToken } from '../../auth/middlewares/verifyToken';
import { requireAdmin } from '../../auth/middlewares/requireAdmin';

const router = Router();

router.post('/employees', verifyToken, requireAdmin, createEmployee);
router.get('/employees', verifyToken, requireAdmin, getAllEmployees);
router.put('/employees/:id', verifyToken, requireAdmin, updateEmployee);
router.delete('/employees/:id', verifyToken, requireAdmin, deleteEmployee);

export default router;
