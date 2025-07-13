import { PrismaClient } from '@prisma/client';
import {startOfDay, endOfDay, parseISO, endOfToday, startOfMonth} from 'date-fns';

const prisma = new PrismaClient();

export const createAttendance = async (userId: number, type: string) => {
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    const todaysAttendances = await prisma.attendance.findMany({
        where: {
            userId,
            timestamp: {
                gte: todayStart,
                lte: todayEnd
            }
        }
    });

    const hasMasuk = todaysAttendances.some((a) => a.type === 'masuk');
    const hasPulang = todaysAttendances.some((a) => a.type === 'pulang');

    if (type === 'masuk' && hasMasuk) {
        throw new Error('Anda sudah absen masuk hari ini');
    }

    if (type === 'pulang') {
        if (!hasMasuk) {
            throw new Error('Anda belum absen masuk hari ini');
        }
        if (hasPulang) {
            throw new Error('Anda sudah absen pulang hari ini');
        }
    }

    return prisma.attendance.create({
        data: {
            userId,
            type
        }
    });
};

export const getAttendanceSummary = async (userId: number, start?: string, end?: string, page: number = 1, pageSize: number = 20) => {
    const startDate = start ? parseISO(start) : startOfMonth(new Date());
    const endDate = end ? parseISO(end) : endOfToday();
    const skip = (page - 1) * pageSize;

    const where = {
        userId,
        timestamp: {
            gte: startDate,
            lte: endDate
        }
    };

    const [data, total] = await Promise.all([
        prisma.attendance.findMany({
            where,
            orderBy: { timestamp: 'asc' },
            skip,
            take: pageSize
        }),
        prisma.attendance.count({ where })
    ]);

    return {
        data,
        meta: {
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize)
        }
    };
};

export const getAttendanceRecords = async (query: {
    startDate?: string;
    endDate?: string;
    employeeId?: string;
    email?: string;
    page?: string;
    limit?: string;
}) => {
    const { startDate, endDate, employeeId, email, page = '1', limit = '20' } = query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (startDate || endDate) {
        where.timestamp = {};
        if (startDate) where.timestamp.gte = new Date(startDate);
        if (endDate) where.timestamp.lte = new Date(endDate);
    }

    if (employeeId) {
        where.employeeId = Number(employeeId);
    }

    if (email) {
        where.employee = {
            email: {
                contains: email,
                mode: 'insensitive'
            }
        };
    }

    const [data, total] = await Promise.all([
        prisma.attendance.findMany({
            where,
            skip,
            take: limitNum,
            include: {
                employee: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: { timestamp: 'desc' }
        }),
        prisma.attendance.count({ where })
    ]);

    return {
        data,
        meta: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum)
        }
    };
};

