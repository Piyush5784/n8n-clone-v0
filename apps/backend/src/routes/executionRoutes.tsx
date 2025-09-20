import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { PrismaClient } from "@repo/db/client";

const prisma = new PrismaClient();
const router = Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const executions = await prisma.executions.findMany({
      where: {
        workflowId: req.body.workflowId,
      },
    });

    return res.json({
      message: "Executions successfully fetched",
      executions,
    });
  } catch (error) {
    return res.json({
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
});

export const ExecutionRoutes = router;
