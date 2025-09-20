import { PrismaClient } from "@repo/db/client";
import express from "express";
import { authMiddleware } from "./authMiddleware";
import cors from "cors";
const app = express();
const port = 5000;

const client = new PrismaClient();

app.use(express.json());
app.use(cors());

app.get(
  "/api/v1/workflow/execute/:workflowId",
  authMiddleware,
  async (req, res) => {
    try {
      const userId = req.userId!;

      const workflowId = req.params.workflowId;

      if (!userId || !workflowId) {
        return res.status(400).json({
          message: "Invalid user or workflow Id",
        });
      }

      await client.$transaction(async (tx) => {
        const run = await tx.executions.create({
          data: {
            workflowId,
            status: "Processing",
          },
        });

        await tx.executionsOutbox.create({
          data: {
            executionId: run.id,
          },
        });
      });

      return res.json({
        message: "Execution started",
        success: true,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        message: "Failed to execute workflow",
        success: false,
      });
    }
  }
);

app.listen(port, () => {
  console.log("Server started on port ", port);
});
