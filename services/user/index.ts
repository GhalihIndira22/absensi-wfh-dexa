import express from 'express';
import dotenv from 'dotenv';
import profileRoutes from './routes/profile.route';
import cors from "cors";
import path from "node:path";

dotenv.config();
const app = express();
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use('/user', profileRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

const PORT = process.env.USER_PORT || 3002;
app.listen(PORT, () => {
    console.log(`User Service running on port ${PORT}`);
});
