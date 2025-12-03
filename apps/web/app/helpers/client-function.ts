"use client";

export const getToken = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return "";
  }

  return token;
};
