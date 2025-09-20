import { z } from "zod";

export const SigninSchema = z.object({
  username: z.string(),
  password: z.string().min(4),
  email: z.email(),
});

export const SignupSchema = z.object({
  username: z.string(),
  password: z.string().min(4),
  email: z.email(),
});

export const createWorkflow = z.object({
  title: z.string(),
  description: z.string().optional(),
});

export interface CustomNode {
  id: string;
  data: {
    label: "trigger" | "webhook" | "sendEmail" | "sendTelegram";
    webhookId: string;
    metadata?: any;
  };
  position: { x: number; y: number };
}

export const updateWorkflowSchema = z.object({
  workflowId: z.string(),
  nodes: z.array(
    z.object({
      id: z.string(),
      data: z.object({
        label: z.enum(["trigger", "webhook", "sendEmail", "sendTelegram"]),
        webhookId: z.string(),
      }),
      position: z.object({
        x: z.number(),
        y: z.number(),
      }),
    })
  ),
  edges: z.any().optional(),
});

export const createCredentialSchema = z.object({
  type: z.string(),
  data: z.json(),
});
