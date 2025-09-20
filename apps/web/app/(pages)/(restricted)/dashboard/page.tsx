"use client";
import { Button } from "@repo/ui/button";
import React, { useState, useEffect } from "react";
import { getWorkflows } from "../../../helpers/function";
import Loader from "../../../components/Loader";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuth } from "../../../hooks/useAuth";

interface Workflow {
  id: string;
  title: string;
  description: string | null;
  nodeCount: number;
}

interface WorkflowsResponse {
  workflows: Workflow[];
  success: boolean;
  error?: string;
}

const Page = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getAuthHeader, isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchWorkflows = async () => {
      try {
        const authHeader = getAuthHeader();
        if (!authHeader) {
          setError("Authentication required");
          setLoading(false);
          return;
        }

        const data = (await getWorkflows()) as WorkflowsResponse;

        if (!data.success || data.error) {
          setError("Error loading workflows");
          setLoading(false);
          return;
        }

        setWorkflows(data.workflows || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching workflows:", error);
        setError("Failed to load workflows");
        setLoading(false);
        toast.error("Failed to fetch workflows");
      }
    };

    fetchWorkflows();
  }, [isAuthenticated]);

  if (authLoading || loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-red-50 rounded-lg border border-red-200">
        <div className="text-center">
          <div className="text-red-600 mb-2">⚠️</div>
          <h3 className="font-semibold text-gray-900 mb-1">{error}</h3>
          <p className="text-sm text-gray-600">Please try again later</p>
        </div>
      </div>
    );
  }

  if (workflows.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-blue-50 rounded-lg border border-blue-200">
        <div className="text-center">
          <div className="text-4xl mb-4">📋</div>
          <h3 className="font-semibold text-gray-900 mb-2">No workflows yet</h3>
          <p className="text-sm text-gray-600">
            Click "Create Workflow" above to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Workflow
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Nodes
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {workflows.map((workflow) => (
              <tr key={workflow.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">
                    {workflow.title}
                  </div>
                  <div className="text-xs text-gray-500">
                    ID: {workflow.id.slice(0, 8)}...
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                  {workflow.description || (
                    <span className="text-gray-400">No description</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                    {workflow.nodeCount}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Link href={`/workflow/${workflow.id}`}>
                      <Button>View</Button>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  return <Page />;
}
