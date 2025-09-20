import z from "zod";
export interface CustomNode {
  id: string;
  data: {
    label: "trigger" | "webhook" | "sendEmail" | "sendTelegram";
    webhookId: string;
    metadata?: any;
  };
  position: { x: number; y: number };
}

export interface WorkflowResponse {
  id: string;
  title: string;
  description: string | null;
  nodes: CustomNode[];
  edges: any[];
}

export interface WorkflowUpdateRequest {
  workflowId: string;
  nodes: CustomNode[];
  edges: any[];
}

export interface AvailableWebhook {
  id: string;
  image: string;
  type: "trigger" | "webhook" | "sendEmail" | "sendTelegram";
}

export const SigninSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
});

export const SignupSchema = z.object({
  username: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(4),
});
