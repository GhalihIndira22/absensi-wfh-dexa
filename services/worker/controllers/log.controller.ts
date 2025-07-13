import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllLogs = async (req: Request, res: Response) => {
    try {
        const {
            email,
            employeeId,
            startDate,
            endDate,
            page = '1',
            pageSize = '10'
        } = req.query;

        const where: any = {};

        if (employeeId) where.employeeId = Number(employeeId);
        if (email) where.user = { email: { contains: String(email), mode: 'insensitive' } };
        if (startDate || endDate) {
            where.changedAt = {};
            if (startDate) where.changedAt.gte = new Date(String(startDate));
            if (endDate) where.changedAt.lte = new Date(String(endDate));
        }

        const skip = (Number(page) - 1) * Number(pageSize);
        const take = Number(pageSize);

        const [data, total] = await Promise.all([
            prisma.profileChangeLog.findMany({
                where,
                skip,
                take,
                orderBy: { changedAt: 'desc' },
                include: { user: true }
            }),
            prisma.profileChangeLog.count({ where })
        ]);

        res.json({ data, total });
    } catch (err) {
        console.error('Error fetching logs:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};