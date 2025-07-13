import express from 'express';
import { startConsumer } from './kafka/consumer';
import logRoutes from './routes/log.route';
import cors from "cors";
import {sendTestNotificationToTopic} from "./testTopic";

const app = express();
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));


app.use('/', logRoutes);
sendTestNotificationToTopic();

const PORT = 3005;
app.listen(PORT, () => {
    console.log(`Worker Service running on port ${PORT}`);
});

startConsumer().then(() =>
    console.log('Kafka Consumer is listening...')
);
