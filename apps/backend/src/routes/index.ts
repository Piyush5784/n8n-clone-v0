import { Router } from "express";
import { authRoutes } from "./authRoutes";
import { webhookRoutes } from "./webhookRoutes";
import { workflowRoutes } from "./workflowRoutes";
import { credentialsRoutes } from "./credentialsRoutes";
import { ExecutionRoutes } from "./executionRoutes";

const router = Router();

router.use("/auth", authRoutes);

router.use("/webhook", webhookRoutes);

router.use("/workflow", workflowRoutes);

router.use("/credentails", credentialsRoutes);

router.use("/executions", ExecutionRoutes);

export const Routes = router;
