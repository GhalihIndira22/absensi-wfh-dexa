import express from 'express';
import { startConsumer } from './kafka/consumer';
import logRoutes from './routes/log.route';

const app = express();
app.use(express.json());

app.use('/', logRoutes); // ✅ expose endpoint GET /logs

const PORT = 3005;
app.listen(PORT, () => {
    console.log(`Worker Service running on port ${PORT}`);
});

startConsumer().then(() =>
    console.log('Kafka Consumer is listening...')
);
