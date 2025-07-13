import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route';
import cors from 'cors';

dotenv.config();
const app = express();
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use('/user', authRoutes);

const PORT = process.env.AUTH_PORT || 3001;
app.listen(PORT, () => {
    console.log(`Auth Service running on port ${PORT}`);
});
