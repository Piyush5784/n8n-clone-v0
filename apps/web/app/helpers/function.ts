import axios from "axios";
import { BACKEND_URL } from "../config";

export async function getWebhooks() {
  const res = await axios.get(`${BACKEND_URL}/webhook/getAll`);
  return res.data;
}
