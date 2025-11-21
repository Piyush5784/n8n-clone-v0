"use client";
import React, { useState, useEffect } from "react";
import { getWorkflows } from "../../../../helpers/function";
import Loader from "../../../../components/Loader";
import Link from "next/link";
import { useAuth } from "../../../../hooks/useAuth";
import { BACKEND_URL, BACKEND_URL_HOOKS } from "../../../../config";

import { CopyButton } from "@/components/copy-button";
import { Button } from "@/components/Buttons";
import { toast } from "sonner";

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
  // const [copy, setCopy];
  const [error, setError] = useState<string | null>(null);
  const { getAuthHeader, isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      setLoading(false);
      setError("You must be logged in to view workflows.");
      return;
    }

    const fetchWorkflows = async () => {
      try {
        const authHeader = getAuthHeader();
        if (!authHeader) {
          setError("Authentication required. Please log in again.");
          setLoading(false);
          return;
        }

        const data = (await getWorkflows()) as WorkflowsResponse;

        if (!data.success || data.error) {
          setError(data.error || "Error loading workflows.");
          setLoading(false);
          return;
        }

        setWorkflows(data.workflows || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching workflows:", error);
        setError("Failed to load workflows. Please check your connection.");
        setLoading(false);
        toast.error("Failed to fetch workflows");
      }
    };

    fetchWorkflows();
  }, [isAuthenticated, authLoading]);

  if (authLoading || loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center h-64 bg-red-50 rounded-xl border border-red-200 shadow-sm p-6">
          <div className="text-5xl text-red-500 mb-4">⚠️</div>
          <h3 className="font-bold text-xl text-gray-900 mb-2">{error}</h3>
          <p className="text-base text-gray-600 text-center">
            There was an issue loading your workflows. Please try refreshing the
            page or logging in again.
          </p>
          <Button onClick={() => window.location.reload()}>Refresh Page</Button>
        </div>
      </div>
    );
  }

  if (workflows.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center h-64 bg-blue-50 rounded-xl border border-blue-200 shadow-sm p-6">
          {/* <DocumentTextIcon className="h-12 w-12 text-blue-500 mb-4" /> */}
          <div className="text-5xl text-blue-500 mb-4">📋</div>
          <h3 className="font-bold text-xl text-gray-900 mb-2">
            No workflows yet
          </h3>
          <p className="text-base text-gray-600 text-center">
            It looks like you haven't created any workflows. Get started by
            creating your first one!
          </p>
          {/* Assuming there's a route to create a workflow */}
          <Link href="/workflow/create" passHref>
            <Button>Create Workflow</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-1 py-8 pt-0 pl-0 ">
      <div className="bg-white rounded-xl shadow-lg border border-gray-300 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Workflow
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Webhook URL
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Nodes
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {workflows.map((workflow) => {
                const workflowUrl = `${BACKEND_URL_HOOKS}/workflow/execute/${workflow.id}`;
                return (
                  <tr
                    key={workflow.id}
                    className="hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-gray-900 text-base">
                        {workflow.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        ID:{" "}
                        <span className="font-mono">
                          {workflow.id.slice(0, 8)}...
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs overflow-hidden text-ellipsis">
                      {workflow.description || (
                        <span className="text-gray-400 italic">
                          No description provided
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Link
                          href={workflowUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 px-2 py-2 border rounded-lg truncate max-w-[150px] block"
                          title={workflowUrl}
                        >
                          {workflowUrl.replace(/^https?:\/\//, "")}
                          ...{workflow.id.slice(0, 4)}
                        </Link>
                        <CopyButton value={workflowUrl} />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {workflow.nodeCount}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <Link href={`/workflow/${workflow.id}`} passHref>
                          <Button variant="outline">View</Button>
                        </Link>
                        <Link href={`/workflow/${workflow.id}`} passHref>
                          <Button variant="outline">Edit</Button>
                        </Link>
                        <Button variant="outline">Delete</Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  return <Page />;
}
