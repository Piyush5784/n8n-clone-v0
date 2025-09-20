"use client";

export const getToken = () => {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return "";
  }
  const token = localStorage.getItem("token");
  console.log(token);

  if (!token) {
    console.log(!token);
    window.location.href = "/signin";
    return "";
  }

  return token;
};
