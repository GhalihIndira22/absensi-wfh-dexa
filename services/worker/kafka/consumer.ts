import { Kafka } from 'kafkajs';
import { saveLog } from '../services/log.service';

const kafka = new Kafka({
    clientId: 'worker-service',
    brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'log-group' });

export const startConsumer = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: 'profile_update', fromBeginning: false });

    await consumer.run({
        eachMessage: async ({ message }) => {
            if (!message.value) return;

            const payload = JSON.parse(message.value.toString());
            await saveLog(payload);
        }
    });
};
