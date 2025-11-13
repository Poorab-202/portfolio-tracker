import dotenv from "dotenv";
dotenv.config();
import { Kafka } from "kafkajs";

const brokers = process.env.KAFKA_BROKERS
  ? process.env.KAFKA_BROKERS.split(",")
  : ["localhost:9092"];

const kafkaConfig = {
  clientId: process.env.KAFKA_CLIENT_ID || "lotwise-backend",
  brokers,
};

if (process.env.KAFKA_SASL_USERNAME && process.env.KAFKA_SASL_PASSWORD) {
  kafkaConfig.ssl = true;
  kafkaConfig.sasl = {
    mechanism: "scram-sha-256",     
    username: process.env.KAFKA_SASL_USERNAME,
    password: process.env.KAFKA_SASL_PASSWORD,
  };
}

const kafka = new Kafka(kafkaConfig);

export const producer = kafka.producer();
export const createConsumer = (groupId) =>
  kafka.consumer({ groupId });
