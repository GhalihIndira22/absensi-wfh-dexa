import { Request, Response } from 'express';
import {createAttendance, getAttendanceRecords} from '../services/attendance.service';
import { getAttendanceSummary } from '../services/attendance.service';


export const absen = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        const { type } = req.body;

        if (!['masuk', 'pulang'].includes(type)) {
            return res.status(400).json({ message: 'Tipe absen harus \"masuk\" atau \"pulang\"' });
        }

        const result = await createAttendance(user!.id, type);
        res.json(result);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
};

export const getSummary = async (req: Request, res: Response) => {
    try {
        const user = req.user!;
        const { start, end } = req.query;

        const summary = await getAttendanceSummary(user.id, start as string, end as string);
        res.json(summary);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const getAllAttendance = async (req: Request, res: Response) => {
    const attendances = await getAttendanceRecords(req.query);
    res.json(attendances);
};

