import { PrismaClient } from "@prisma/client";
import { JsonObject } from "@prisma/client/runtime/library";
import { Kafka } from "kafkajs";
import {
  parseTemplate,
  sendEmail,
  sendTelegramMsg,
  ExecutionResult,
} from "./helper";
import { execute } from "./agentTool";

const prisma = new PrismaClient();
const TOPIC_NAME = "zap-events";

const kafka = new Kafka({
  clientId: "outbox-processor",
  brokers: ["localhost:9092"],
});

async function main() {
  const consumer = kafka.consumer({ groupId: "main-worker" });
  await consumer.connect();
  const producer = kafka.producer();
  await producer.connect();

  await consumer.subscribe({ topic: TOPIC_NAME, fromBeginning: true });

  await consumer.run({
    autoCommit: false,
    eachMessage: async ({ topic, partition, message }) => {
      if (!message.value?.toString()) {
        return;
      }

      const parsedValue = JSON.parse(message.value?.toString());
      const workflowId = parsedValue.workflowId;
      const stage = parsedValue.stage;
      const executionId = parsedValue.executionId;

      console.log({ parsedValue });

      const workflowDetails = await prisma.workflow.findFirst({
        where: {
          id: workflowId,
        },
        select: {
          userId: true,
          nodes: {
            select: {
              id: true,
              data: true,
              metadata: true,
            },
          },
        },
      });

      if (!workflowDetails || !workflowDetails.nodes) {
        console.log("Workflow not found or has no nodes");
        return;
      }

      // Find the current node/action based on stage
      const currentNode = workflowDetails.nodes[stage];

      if (!currentNode) {
        console.log("Current node not found for stage:", stage);
        return;
      }

      const nodeData = currentNode.data as JsonObject;
      const nodeMetadata = currentNode.metadata as JsonObject;
      const userId = workflowDetails.userId;

      console.log("Node data ", nodeData);
      console.log("Node metadata ", nodeMetadata);
      console.log("User id ", userId);

      let nodeResult: ExecutionResult = { success: true };

      if (nodeData?.label === "AiAgent") {
        console.log("Processing an ai agent call");

        const var1 = parseTemplate(
          (nodeMetadata?.var1 as string) || "No variable a found",
          nodeMetadata
        );

        const var2 = parseTemplate(
          (nodeMetadata?.var2 as string) || "No variable a found",
          nodeMetadata
        );

        console.log({
          var1,
          var2,
        });

        nodeResult = await execute(var1, var2);

        console.log(nodeResult);

        if (nodeMetadata.sendResponse) {
          if (nodeMetadata.actionType == "email") {
            await sendEmail(
              userId,
              nodeMetadata.to as string,
              "Ai result",
              JSON.stringify(nodeResult.successResponse)
            );
          }
          if (nodeMetadata.actionType == "telegram") {
            await sendTelegramMsg(userId, {
              ...nodeMetadata,
              message: JSON.stringify(nodeResult.successResponse),
            });
          }
        }
      }
      if (nodeData?.label === "sendEmail") {
        const subject = parseTemplate(
          (nodeMetadata?.subject as string) || "No Subject",
          nodeMetadata
        );
        const body = parseTemplate(
          (nodeMetadata?.body as string) || "",
          nodeMetadata
        );
        const to = parseTemplate(
          (nodeMetadata?.to as string) || "",
          nodeMetadata
        );

        console.log(`Processing email node: sending to ${to}`);

        nodeResult = await sendEmail(userId, to, subject, body);
      }

      if (nodeData?.label === "sendTelegram") {
        console.log(`Processing Telegram node: sending message`);
        nodeResult = await sendTelegramMsg(userId, nodeMetadata);
      }

      if (!nodeResult.success) {
        console.error(`Node execution failed: ${nodeResult.failedReason}`);

        try {
          await prisma.executions.update({
            where: { id: executionId },
            data: {
              status: "Failed",
              failedReason: nodeResult.failedReason || "Node execution failed",
            },
          });
          console.log("Workflow marked as failed due to node error");
        } catch (error) {
          console.error("Failed to update execution status:", error);
        }

        // Commit the offset and stop processing this workflow
        await consumer.commitOffsets([
          {
            topic: TOPIC_NAME,
            partition: partition,
            offset: (parseInt(message.offset) + 1).toString(),
          },
        ]);
        return;
      }

      await new Promise((r) => setTimeout(r, 500));

      const totalNodes = workflowDetails.nodes.length;
      const lastStage = totalNodes - 1;

      if (lastStage !== stage) {
        console.log("pushing back to the queue");
        await producer.send({
          topic: TOPIC_NAME,
          messages: [
            {
              value: JSON.stringify({
                stage: stage + 1,
                workflowId,
                executionId,
              }),
            },
          ],
        });
      } else {
        try {
          await prisma.executions.update({
            where: { id: executionId, workflowId },
            data: {
              status: "Success",
            },
          });
          console.log("Workflow marked as complete", executionId);
        } catch (error) {
          console.error("Failed to mark workflow as complete:", error);
        }
      }

      console.log("processing done");

      await consumer.commitOffsets([
        {
          topic: TOPIC_NAME,
          partition: partition,
          offset: (parseInt(message.offset) + 1).toString(),
        },
      ]);
    },
  });
}

main();
