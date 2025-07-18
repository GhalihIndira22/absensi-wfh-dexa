import { PrismaClient } from '@prisma/client';
import {startOfDay, endOfDay, parseISO, endOfToday, startOfMonth} from 'date-fns';
import { AttendanceType } from '../dto/attendance-type.enum';

const prisma = new PrismaClient();

export const createAttendance = async (userId: number, type: AttendanceType) => {
    console.log('[createAttendance] Input:', { userId, type });
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

    const hasCheckIn = todaysAttendances.some((a) => a.type === AttendanceType.CHECKIN);
    const hasCheckOut = todaysAttendances.some((a) => a.type === AttendanceType.CHECKOUT);

    if (type === AttendanceType.CHECKIN && hasCheckIn) {
        console.error('[createAttendance] Error: Sudah absen masuk hari ini', { userId });
        throw new Error('Anda sudah absen masuk hari ini');
    }

    if (type === AttendanceType.CHECKOUT) {
        if (!hasCheckIn) {
            console.error('[createAttendance] Error: Belum absen masuk hari ini', { userId });
            throw new Error('Anda belum absen masuk hari ini');
        }
        if (hasCheckOut) {
            console.error('[createAttendance] Error: Sudah absen pulang hari ini', { userId });
            throw new Error('Anda sudah absen pulang hari ini');
        }
    }

    const attendance = await prisma.attendance.create({
        data: {
            userId,
            type
        }
    });
    console.log('[createAttendance] Success:', attendance);
    return attendance;
};

export const getAttendanceSummary = async (userId: number, start?: string, end?: string, page: number = 1, pageSize: number = 20) => {
    console.log('[getAttendanceSummary] Input:', { userId, start, end, page, pageSize });
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

    const result = {
        data,
        meta: {
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize)
        }
    };
    console.log('[getAttendanceSummary] Result:', result);
    return result;
};

export const getAttendanceRecords = async (query: {
    startDate?: string;
    endDate?: string;
    employeeId?: string;
    email?: string;
    page?: string;
    limit?: string;
}) => {
    console.log('[getAttendanceRecords] Query:', query);
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

    const result = {
        data,
        meta: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum)
        }
    };
    console.log('[getAttendanceRecords] Result:', result);
    return result;
};

