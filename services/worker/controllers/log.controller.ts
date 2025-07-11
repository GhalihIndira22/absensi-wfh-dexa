import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllLogs = async (req: Request, res: Response) => {
    const { startDate, endDate, employeeId, email } = req.query;

    const where: any = {};

    if (startDate || endDate) {
        where.changedAt = {};
        if (startDate) where.changedAt.gte = new Date(startDate as string);
        if (endDate) where.changedAt.lte = new Date(endDate as string);
    }

    if (employeeId) {
        where.employeeId = Number(employeeId);
    }

    if (email) {
        where.user = {
            email: {
                contains: email as string,
                mode: 'insensitive'
            }
        };
    }

    const logs = await prisma.profileChangeLog.findMany({
        where,
        include: {
            user: {
                select: {
                    email: true,
                    name: true
                }
            }
        },
        orderBy: {
            changedAt: 'desc'
        }
    });

    res.json(logs);
};
