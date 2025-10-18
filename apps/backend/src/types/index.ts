import { z } from "zod";

import {
  AvailableWebhook,
  CustomNode,
  hookType,
  hookTypesArr,
} from "@repo/types";
export const SigninSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
});

export const SignupSchema = z.object({
  username: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(4),
});

export const createWorkflow = z.object({
  title: z.string(),
  description: z.string().optional(),
});

export const updateWorkflowSchema = z.object({
  workflowId: z.string(),
  nodes: z.array(
    z.object({
      id: z.string(),
      data: z.object({
        label: z.enum(hookTypesArr),
        webhookId: z.string(),
        metadata: z.any().optional(),
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
