"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "./Buttons";

const LogoutButton = () => {
  const router = useRouter();

  function logout() {
    localStorage.removeItem("token");
    return router.push("/signin");
  }

  return (
    <Button onClick={logout} variant={"default"} className="w-full">
      Logout
    </Button>
  );
};

export default LogoutButton;
