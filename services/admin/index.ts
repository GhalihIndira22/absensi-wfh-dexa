import express from 'express';
import dotenv from 'dotenv';
import employeeRoutes from './routes/employee.route';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/admin', employeeRoutes);

app.get('/', (_, res) => {
    res.json({ status: 'Admin Service is running' });
});

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
    console.log(`Admin Service running on port ${PORT}`);
});
