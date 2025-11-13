import dotenv from "dotenv";
dotenv.config();
import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "test",
  brokers: [process.env.KAFKA_BROKER]
});

const producer = kafka.producer();

async function run() {
  await producer.connect();
  console.log("Producer connected to:", process.env.KAFKA_BROKER);

  await producer.send({
    topic: "trades",
    messages: [{ key: "TST", value: JSON.stringify({msg:"hello"}) }]
  });

  console.log("Message sent");
  await producer.disconnect();
}

run().catch(err => console.error("Test error:", err));
