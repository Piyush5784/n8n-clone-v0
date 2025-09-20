import { PrismaClient } from "@repo/db/client";
import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { createCredentialSchema, createWorkflow } from "../types";
import { parseAsync } from "zod";

const router = Router();
const prisma = new PrismaClient();
router.post("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId!;
    const parsedData = createCredentialSchema.safeParse(req.body);

    if (!parsedData.success) {
      return res.status(404).json({
        message: "Invalid data",
      });
    }

    await prisma.credentials.create({
      data: {
        userId,
        type: parsedData.data?.type,
        data: parsedData.data.data,
      },
    });

    return res.json({
      message: "Credentials successfully created",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Something went wrong ",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const userId = req.userId!;
    const credentails = await prisma.credentials.findMany({
      where: {
        userId,
      },
    });

    const data = credentails.map((c) => ({
      type: c.type,
      id: c.id,
    }));

    return res.json({
      message: "Credentails successfully fetched",
      credentials: data,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: error instanceof Error ? error.message : "Something went wrong ",
    });
  }
});

export const credentialsRoutes = router;
