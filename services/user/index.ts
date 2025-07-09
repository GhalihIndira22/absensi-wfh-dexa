import express from 'express';
import dotenv from 'dotenv';
import profileRoutes from './routes/profile.route';

dotenv.config();
const app = express();
app.use(express.json());

app.use('/user', profileRoutes);

const PORT = 3002;
app.listen(PORT, () => {
    console.log(`User Service running on port ${PORT}`);
});
