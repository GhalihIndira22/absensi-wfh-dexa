import { Request, Response } from 'express';
import { createEmployeeService, getAllEmployeesService, updateEmployeeService, deleteEmployeeService } from '../services/employee.service';
import { CreateEmployeeDto } from '../dto/employee.dto';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';
import {PrismaClient} from "@prisma/client";


export const createEmployee = async (req: Request, res: Response) => {
    console.log('[createEmployee] Request body:', req.body);
    try {
        const createEmployeeRequestDto: CreateEmployeeDto = req.body;
        const newUser = await createEmployeeService(createEmployeeRequestDto);
        console.log('[createEmployee] Response:', { message: 'Employee created', id: newUser.id });
        res.status(201).json({ message: 'Employee created', id: newUser.id });
    } catch (error: any) {
        console.error('[createEmployee] Error:', error.message);
        if (error.message === 'Email already registered') {
            return res.status(409).json({ message: error.message });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAllEmployees = async (req: Request, res: Response) => {
    console.log('[getAllEmployees] Query:', req.query);
    try {
        const result = await getAllEmployeesService(req.query);
        console.log('[getAllEmployees] Response:', result);
        res.json(result);
    } catch (error) {
        console.error('[getAllEmployees] Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateEmployee = async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log(`[updateEmployee] id: ${id} - Request body:`, req.body);
    try {
        const updateEmployeeRequestDto: UpdateEmployeeDto = req.body;
        await updateEmployeeService(Number(id), updateEmployeeRequestDto);
        console.log(`[updateEmployee] id: ${id} - Response:`, { message: 'Employee updated', id: id });
        res.json({ message: 'Employee updated', id: id });
    } catch (error) {
        console.error(`[updateEmployee] id: ${id} - Error:`, error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteEmployee = async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log(`[deleteEmployee] id: ${id}`);
    try {
        await deleteEmployeeService(Number(id));
        console.log(`[deleteEmployee] id: ${id} - Response:`, { message: 'Employee soft-deleted', id: Number(id) });
        res.json({ message: 'Employee soft-deleted', id: Number(id) });
    } catch (error: any) {
        console.error(`[deleteEmployee] id: ${id} - Error:`, error.message);
        if (error.message === 'Employee not found') {
            return res.status(404).json({ message: error.message });
        }
        if (error.message === 'Cannot delete admin account') {
            return res.status(403).json({ message: error.message });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
};

