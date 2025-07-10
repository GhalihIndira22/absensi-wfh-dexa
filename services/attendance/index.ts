import express from 'express';
import dotenv from 'dotenv';
import attendanceRoutes from './routes/attendance.route';

dotenv.config({ path: '../../.env' }); // Load dari root .env

const app = express();
app.use(express.json());

app.use('/attendance', attendanceRoutes);

const PORT = process.env.ATTENDANCE_PORT || 3003;
app.listen(PORT, () => {
    console.log(`Attendance Service running on port ${PORT}`);
});
