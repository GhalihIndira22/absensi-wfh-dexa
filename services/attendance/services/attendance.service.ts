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

export const getAttendanceSummary = async (userId: number, start?: string, end?: string) => {
    const startDate = start ? parseISO(start) : startOfMonth(new Date());
    const endDate = end ? parseISO(end) : endOfToday();

    return prisma.attendance.findMany({
        where: {
            userId,
            timestamp: {
                gte: startDate,
                lte: endDate
            }
        },
        orderBy: {
            timestamp: 'asc'
        }
    });
};

export const getAttendanceRecords = async (query: {
    startDate?: string;
    endDate?: string;
    employeeId?: string;
    email?: string;
}) => {
    const { startDate, endDate, employeeId, email } = query;

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

    return prisma.attendance.findMany({
        where,
        include: {
            employee: {
                select: {
                    name: true,
                    email: true
                }
            }
        },
        orderBy: { timestamp: 'desc' }
    });
};
