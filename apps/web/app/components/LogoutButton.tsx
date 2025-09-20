"use client";
import React from "react";
import { Button } from "./Buttons";
import { useRouter } from "next/navigation";

const LogoutButton = () => {
  const router = useRouter();
  function logout() {
    if (typeof window === "undefined" || typeof localStorage === "undefined") {
      return "";
    }
    localStorage.removeItem("token");
    router.push("/signin");
  }
  return (
    <Button variant="red" onClick={logout} className="w-full">
      Logout
    </Button>
  );
};

export default LogoutButton;
