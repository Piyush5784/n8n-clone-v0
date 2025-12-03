import axios from "axios";
import { BACKEND_URL } from "../config";
import { AvailableWebhook, hookType, hookTypesArr } from "@repo/types";

export async function getWebhooks(TOKEN: string) {
  const res = await axios.get(`${BACKEND_URL}/webhook/getAll`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  return res.data;
}

export async function getWorkflows(TOKEN: string) {
  const res = await axios.get(`${BACKEND_URL}/workflow`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  return res.data;
}

export async function getExecutions(TOKEN: string) {
  const res = await axios.get(`${BACKEND_URL}/workflow`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  return res.data;
}

export async function getCredentails(TOKEN: string) {
  const res = await axios.get(`${BACKEND_URL}/credentails`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  return res.data;
}

export function webhookType(hook: AvailableWebhook): string {
  const validTypes: hookType[] = hookTypesArr;
  return validTypes.includes(hook.type as hookType) ? hook.type : "webhook";
}
