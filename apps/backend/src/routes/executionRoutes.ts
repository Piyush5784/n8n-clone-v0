import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { PrismaClient } from "@repo/db/client";

const prisma = new PrismaClient();
const router = Router();

router.get("/:workflowId", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { workflowId } = req.params;

    const workflow = await prisma.workflow.findFirst({
      where: {
        id: workflowId,
        userId: userId,
      },
    });

    if (!workflow) {
      return res.status(404).json({
        message: "Workflow not found",
      });
    }

    const executions = await prisma.executions.findMany({
      where: {
        workflowId: workflowId,
      },
      orderBy: {
        id: "desc",
      },
    });

    return res.json({
      message: "Executions successfully fetched",
      executions,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
});

export const ExecutionRoutes = router;
