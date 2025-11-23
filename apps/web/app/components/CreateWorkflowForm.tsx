import axios from "axios";
import React, { useState } from "react";
import { BACKEND_URL, TOKEN } from "../config";
import { useRouter } from "next/navigation";
import { Button } from "./Buttons";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { X } from "lucide-react";
import { toast } from "sonner";

interface CreateWorkflowFormProps {
  isOpen: boolean;
  onClose?: () => void;
  onWorkflowCreated?: (workflowId: string) => void;
}

interface WorkflowData {
  title: string;
  description: string;
}

interface CreateWorkflowResponse {
  success: boolean;
  workflowId?: string;
  message?: string;
}

const CreateWorkflowForm = ({ isOpen, onClose }: CreateWorkflowFormProps) => {
  const [formData, setFormData] = useState<WorkflowData>({
    title: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post<CreateWorkflowResponse>(
        `${BACKEND_URL}/workflow/create`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );

      const result = response.data;

      if (result.success) {
        toast.success("Workflow successfully created");
        router.push(`/workflow/${result.workflowId}`);
        if (onClose) {
          onClose();
        }
        setFormData({ title: "", description: "" });
      } else {
        setError(result.message || "Failed to create workflow");
      }
    } catch (error) {
      console.log(error);
      setError("Network error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Create New Workflow</h2>
        <Button
          variant={"outline"}
          onClick={onClose}
          // className="text-gray-500 hover:text-gray-700 text-xl font-bold"
        >
          <X />
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Label
            htmlFor="title"
            className="block text-sm font-medium mb-2 text-gray-700"
          >
            Workflow Title
          </Label>
          <Input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter workflow name..."
            required
          />
        </div>

        <div className="mb-4">
          <Label
            htmlFor="description"
            className="block text-sm font-medium mb-2 text-gray-700"
          >
            Description
          </Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter workflow description..."
            rows={10}
          />
        </div>

        {error && (
          <div className="mb-4 p-3 text-red-700 bg-red-100 border border-red-300 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            onClick={onClose}
            variant={"outline"}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" variant={"default"} disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Workflow"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateWorkflowForm;
