"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useWorkflows = () => {
  return useQuery({
    queryKey: ["workflows"],
    queryFn: () => {
      const res = axios.get(`${BACKEND_URL}`);
    },
  });
};
