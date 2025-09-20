import express from "express";
import { authRoutes } from "./routes/authRoutes";
import { workflowRoutes } from "./routes/workflowRoutes";
import cors from "cors";
import { webhookRoutes } from "./routes/webhookRoutes";
import morgan from "morgan";
import { credentialsRoutes } from "./routes/credentialsRoutes";

const app = express();
const port = 4000;

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/webhook", webhookRoutes);

app.use("/api/v1/workflow", workflowRoutes);

app.use("/api/v1/credentails", credentialsRoutes);

app.listen(port, () => console.log("Server started on port", port));
