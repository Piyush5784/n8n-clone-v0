"use client";

export const getToken = () => {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return "";
  }
  const token = localStorage.getItem("token");

  if (!token) {
    return "";
  }

  return token;
};
