import axios from "axios";
import { BACKEND_URL, TOKEN } from "../config";

export async function getWebhooks() {
  const res = await axios.get(`${BACKEND_URL}/webhook/getAll`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  return res.data;
}

export async function getWorkflows() {
  const res = await axios.get(`${BACKEND_URL}/workflow`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  return res.data;
}

export async function getExecutions() {
  const res = await axios.get(`${BACKEND_URL}/workflow`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  return res.data;
}

export async function getCredentails() {
  const res = await axios.get(`${BACKEND_URL}/credentails`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  return res.data;
}
