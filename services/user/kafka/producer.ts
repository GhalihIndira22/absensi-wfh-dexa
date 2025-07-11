import { Kafka } from 'kafkajs';

const kafka = new Kafka({
    clientId: 'user-service',
    brokers: ['localhost:9092']
});

const producer = kafka.producer();

async function connectProducer() {
    await producer.connect();
}
connectProducer();

export const publishProfileUpdate = async (event: any) => {
    await producer.send({
        topic: 'profile_update',
        messages: [{ value: JSON.stringify(event) }]
    });
};