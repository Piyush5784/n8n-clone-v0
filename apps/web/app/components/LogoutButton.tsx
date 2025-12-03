"use client";
import React from "react";
import { Button } from "./Buttons";
import { useAuth } from "@/hooks/useAuth";

const LogoutButton = () => {
  const { removeAuthToken } = useAuth();

  return (
    <Button onClick={removeAuthToken} variant={"default"} className="w-full">
      Logout
    </Button>
  );
};

export default LogoutButton;
