import express from "express";
import { authRoutes } from "./routes/authRoutes";
import { workflowRoutes } from "./routes/workflowRoutes";
import cors from "cors";
import { webhookRoutes } from "./routes/webhookRoutes";
import morgan from "morgan";
import { credentialsRoutes } from "./routes/credentialsRoutes";
import { Routes } from "./routes";

const app = express();
const port = 4000;

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

app.use("/api/v1", Routes);

app.listen(port, () => console.log("Server started on port", port));
