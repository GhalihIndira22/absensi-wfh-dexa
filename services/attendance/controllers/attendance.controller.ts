import { Request, Response } from 'express';
import {createAttendance, getAttendanceRecords} from '../services/attendance.service';
import { getAttendanceSummary } from '../services/attendance.service';
import { AttendanceType } from '../dto/attendance-type.enum';
import { AbsentDto } from '../dto/absent.dto';

export const absent = async (req: Request, res: Response) => {
    console.log('[absent] Request:', { userId: req.user?.id, body: req.body });
    try {
        const user = req.user;
        const request: AbsentDto = req.body;
        const { type } = request;

        if (!Object.values(AttendanceType).includes(type)) {
            console.error('[absent] Invalid type:', type);
            return res.status(400).json({ message: 'Tipe absen harus "masuk" atau "pulang"' });
        }

        const result = await createAttendance(user!.id, type);
        console.log('[absent] Response:', result);
        res.json(result);
    } catch (err: any) {
        console.error('[absent] Error:', err.message);
        res.status(400).json({ message: err.message });
    }
};

export const getSummary = async (req: Request, res: Response) => {
    console.log('[getSummary] Request:', { userId: req.user?.id, query: req.query });
    try {
        const user = req.user!;
        const { start, end } = req.query;

        const summary = await getAttendanceSummary(user.id, start as string, end as string);
        console.log('[getSummary] Response:', summary);
        res.json(summary);
    } catch (err: any) {
        console.error('[getSummary] Error:', err.message);
        res.status(500).json({ message: err.message });
    }
};

export const getAllAttendance = async (req: Request, res: Response) => {
    console.log('[getAllAttendance] Request:', req.query);
    try {
        const attendances = await getAttendanceRecords(req.query);
        console.log('[getAllAttendance] Response:', attendances);
        res.json(attendances);
    } catch (err: any) {
        console.error('[getAllAttendance] Error:', err.message);
        res.status(500).json({ message: err.message });
    }
};

