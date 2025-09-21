"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
      setIsLoading(false);

      if (!storedToken) {
        router.push("/signin");
      }
    }
  }, [router]);

  const setAuthToken = (newToken: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", newToken);
      setToken(newToken);
    }
  };

  const removeAuthToken = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      setToken(null);
      router.push("/signin");
    }
  };

  const getAuthHeader = (): Record<string, string> | null => {
    return token ? { Authorization: `Bearer ${token}` } : null;
  };

  return {
    token,
    isLoading,
    setAuthToken,
    removeAuthToken,
    getAuthHeader,
    isAuthenticated: !!token,
  };
};
