import { PrismaClient } from "@repo/db/client";
import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();
const prisma = new PrismaClient();

router.get("/getAll", async (req, res) => {
  try {
    const webhooks = await prisma.availabeWebhook.findMany({});
    return res.json({
      message: "Workflows fetched successfully",
      webhooks,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
});
export const webhookRoutes = router;
