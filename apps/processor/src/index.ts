import { PrismaClient } from "@repo/db/client";
import { Kafka } from "kafkajs";

const client = new PrismaClient();

const TOPIC_NAME = "zap-events";
const kafka = new Kafka({
  clientId: "outbox-processor",
  brokers: ["localhost:9092"],
});

async function main() {
  const producer = kafka.producer();
  await producer.connect();

  while (true) {
    const pendingRows = await client.executionsOutbox.findMany({
      take: 10,
      include: {
        execution: {
          include: {
            workflow: true,
          },
        },
      },
    });

    if (pendingRows.length > 0) {
      await producer.send({
        topic: TOPIC_NAME,
        messages: pendingRows.map((r) => ({
          value: JSON.stringify({
            workflowId: r.execution.workflowId,
            executionId: r.executionId,
            stage: 0,
          }),
        })),
      });

      await client.executionsOutbox.deleteMany({
        where: {
          id: {
            in: pendingRows.map((x) => x.id),
          },
        },
      });

      console.log(`Processed ${pendingRows.length} pending executions`);
    }
  }
}

main();
