"use client";
import React from "react";
import { Button } from "./Buttons";
import { useRouter } from "next/navigation";

const LogoutButton = () => {
  const router = useRouter();
  function logout() {
    localStorage.removeItem("token");
    return router.push("/signin");
  }
  return (
    <Button variant="destructive" onClick={logout} className="w-full">
      Logout
    </Button>
  );
};

export default LogoutButton;
