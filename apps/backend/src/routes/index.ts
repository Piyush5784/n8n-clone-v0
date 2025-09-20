import { Router } from "express";
import { authRoutes } from "./authRoutes";
import { webhookRoutes } from "./webhookRoutes";
import { workflowRoutes } from "./workflowRoutes";
import { credentialsRoutes } from "./credentialsRoutes";

const router = Router();

router.use("/auth", authRoutes);

router.use("/webhook", webhookRoutes);

router.use("/workflow", workflowRoutes);

router.use("/credentails", credentialsRoutes);

export const Routes = router;
