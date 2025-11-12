import { Kafka } from "kafkajs";

const kafka = new Kafka({ clientId: "k-test", brokers: ["localhost:9092"] });
const producer = kafka.producer();

async function run() {
  try {
    await producer.connect();
    await producer.send({
      topic: "trades",
      messages: [{ key: "AAPL", value: JSON.stringify({ test: "hello", ts: new Date() }) }]
    });
    console.log("message sent");
  } catch (err) {
    console.error("kafka test error:", err);
  } finally {
    await producer.disconnect();
    process.exit(0);
  }
}

run();
