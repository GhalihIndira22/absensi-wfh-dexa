import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const createEmployee = async (req: Request, res: Response) => {
    const { email, name, position, phoneNumber, password } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        return res.status(409).json({ message: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
        data: {
            email,
            name,
            position,
            phoneNumber,
            passwordHash,
            role: 'employee'
        }
    });

    res.status(201).json({ message: 'Employee created', id: newUser.id });
};

export const getAllEmployees = async (req: Request, res: Response) => {
    const { email, includeInactive, page = '1', pageSize = '10' } = req.query;

    const includeInactiveBool = includeInactive === 'true';
    const pageNumber = Math.max(Number(page), 1);
    const size = Math.max(Number(pageSize), 1);
    const skip = (pageNumber - 1) * size;

    const where: any = {
        role: 'employee',
        ...(includeInactiveBool ? {} : { isActive: true }),
        ...(email && {
            email: {
                contains: email as string,
                mode: 'insensitive'
            }
        })
    };

    const [employees, total] = await Promise.all([
        prisma.user.findMany({
            where,
            select: {
                id: true,
                name: true,
                email: true,
                position: true,
                phoneNumber: true,
                photoUrl: true,
                isActive: true,
                createdAt: true,
                updatedAt: true
            },
            orderBy: {
                createdAt: 'desc'
            },
            skip,
            take: size
        }),
        prisma.user.count({ where })
    ]);

    res.json({
        data: employees,
        page: pageNumber,
        pageSize: size,
        total,
        totalPages: Math.ceil(total / size)
    });
};

export const updateEmployee = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, position, phoneNumber, photoUrl, password } = req.body;

    const updates: any = {};
    if (name) updates.name = name;
    if (position) updates.position = position;
    if (phoneNumber) updates.phoneNumber = phoneNumber;
    if (photoUrl) updates.photoUrl = photoUrl;

    if (password) {
        const bcrypt = await import('bcrypt');
        updates.passwordHash = await bcrypt.hash(password, 10);
    }

    const updated = await prisma.user.update({
        where: { id: Number(id) },
        data: updates
    });

    res.json({ message: 'Employee updated', id: updated.id });
};

export const deleteEmployee = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const target = await prisma.user.findUnique({
            where: { id: Number(id) }
        });

        if (!target) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        if (target.role === 'admin') {
            return res.status(403).json({ message: 'Cannot delete admin account' });
        }

        await prisma.user.update({
            where: { id: Number(id) },
            data: { isActive: false }
        });

        res.json({ message: 'Employee soft-deleted', id: Number(id) });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

