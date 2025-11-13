import { Kafka } from "kafkajs";
import dotenv from "dotenv"
dotenv.config();

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID,
  brokers: [process.env.KAFKA_BROKER],
});

export const producer = kafka.producer();

export const createConsumer = (groupId) => kafka.consumer({ groupId });
