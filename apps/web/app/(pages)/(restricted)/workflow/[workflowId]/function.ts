import { BACKEND_URL } from "@/config";
import { getWebhooks } from "@/helpers/function";
import { AvailableWebhook, CustomNode, hookType } from "@repo/types";
import { Edge, Node } from "@xyflow/react";
import axios from "axios";
import { SetStateAction } from "react";
import { toast } from "sonner";
import { v4 } from "uuid";

export async function SaveWorkflow({
  workflowId,
  nodes,
  edges,
  token,
}: {
  workflowId: string;
  nodes: Node[];
  edges: Edge[];
  token: string;
}) {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/workflow/update`,
      {
        workflowId,
        nodes,
        edges,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = response.data as { success?: boolean };
    if (data.success) {
      toast.success("Workflow saved successfully!");
    } else {
      toast.error("Failed to save workflow");
    }
  } catch (error) {
    console.error("Error saving workflow:", error);
    toast.error("Error saving workflow. Please try again.");
  }
}

export function NodeAdd({
  type,
  webhookId,
  nodes,
  setNodes,
}: {
  type: hookType;
  webhookId: string;
  nodes: Node[];
  setNodes: (value: SetStateAction<Node[]>) => void;
}) {
  // Check if this is the first node and enforce trigger/webhook rule
  if (nodes.length === 0 && type !== "trigger" && type !== "webhook") {
    toast.error("First node must be trigger or webhook");
    return;
  }

  // Check if user is trying to add multiple trigger/webhook nodes
  if (nodes.length > 0 && (type === "trigger" || type === "webhook")) {
    const hasInitialNode = nodes.some(
      (node) => node.data.label === "trigger" || node.data.label === "webhook"
    );
    if (hasInitialNode) {
      toast.error("You can only have one trigger or webhook as the first node");
      return;
    }
  }

  // // Add AiAgent to available webhooks if not present
  // if (
  //   type === "AiAgent" &&
  //   !avaliableWebhook.some((hook) => hook.type === "AiAgent")
  // ) {
  //   // Handle AiAgent node creation
  // }

  const data: CustomNode = {
    id: v4(),
    data: { label: type, webhookId },
    position: {
      x: 0,
      y: 100,
    },
  };
  setNodes((n) => [...n, data]);
  toast.success(`${type} node added successfully`);
}

export async function fetchWebhooks({
  token,
  setAvliableWebhooks,
}: {
  token: string;
  setAvliableWebhooks: (value: SetStateAction<AvailableWebhook[]>) => void;
}) {
  try {
    if (!token) return;
    const data = await getWebhooks(token);
    const webhooks = (data as { webhooks?: AvailableWebhook[] }).webhooks || [];

    setAvliableWebhooks(webhooks);
  } catch (error) {
    console.error("Error fetching webhooks:", error);
    toast.error("Failed to fetch available services");
  }
}
