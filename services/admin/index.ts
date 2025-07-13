import express from 'express';
import dotenv from 'dotenv';
import employeeRoutes from './routes/employee.route';
import cors from "cors";
import fcmRoutes from './routes/fcm.route';


dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use('/admin', employeeRoutes);
app.use(fcmRoutes);

app.get('/', (_, res) => {
    res.json({ status: 'Admin Service is running' });
});

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
    console.log(`Admin Service running on port ${PORT}`);
});
