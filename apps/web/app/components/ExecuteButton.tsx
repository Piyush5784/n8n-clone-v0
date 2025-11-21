"use client";
import React, { useState } from "react";
import axios from "axios";
import { BACKEND_URL, BACKEND_URL_HOOKS, TOKEN } from "../config";
import { Button } from "./Buttons";
import { toast } from "sonner";

const ExecuteButton = ({ workflowId }: { workflowId: string }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${BACKEND_URL_HOOKS}/workflow/execute/${workflowId}`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      console.log(response);
      if (response.data) {
        toast.success((response.data as { message: string }).message);
      }
    } catch (error) {
      console.error("Error executing workflow:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button
        variant="success"
        className="px-6 py-2"
        onClick={handleClick}
        disabled={isLoading}
      >
        {isLoading ? "Executing..." : "Execute"}
      </Button>
    </div>
  );
};

export default ExecuteButton;
