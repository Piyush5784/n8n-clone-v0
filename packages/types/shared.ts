export interface CustomNode {
  id: string;
  data: {
    label: "trigger" | "webhook" | "sendEmail" | "sendTelegram";
    webhookId: string;
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
