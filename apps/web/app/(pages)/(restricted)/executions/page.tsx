"use client";
import { Button } from "@repo/ui/button";
import React, { useState, useEffect } from "react";
import { getExecutions } from "../../../helpers/function";
import Loader from "../../../components/Loader";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuth } from "../../../hooks/useAuth";

interface Execution {
  id: string;
  workflowId: string;
  workflowTitle: string;
  status: "pending" | "running" | "completed" | "failed";
  startedAt: string;
  completedAt: string | null;
  duration: number | null;
  triggeredBy: string;
}

interface ExecutionsResponse {
  executions: Execution[];
  success: boolean;
  error?: string;
}

const Page = () => {
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getAuthHeader, isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchExecutions = async () => {
      try {
        const authHeader = getAuthHeader();
        if (!authHeader) {
          setError("Authentication required");
          setLoading(false);
          return;
        }

        const data = (await getExecutions()) as ExecutionsResponse;

        if (!data.success || data.error) {
          setError("Error loading executions");
          setLoading(false);
          return;
        }

        setExecutions(data.executions || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching executions:", error);
        setError("Failed to load executions");
        setLoading(false);
        toast.error("Failed to fetch executions");
      } finally {
        setLoading(false);
      }
    };

    fetchExecutions();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "running":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDuration = (duration: number | null) => {
    if (!duration) return "-";
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

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

  if (executions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-blue-50 rounded-lg border border-blue-200">
        <div className="text-center">
          <div className="text-4xl mb-4">⚡</div>
          <h3 className="font-semibold text-gray-900 mb-2">
            No executions yet
          </h3>
          <p className="text-sm text-gray-600">
            Run a workflow to see executions here
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
                Execution
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Workflow
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Started
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Triggered By
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {executions.map((execution) => (
              <tr key={execution.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">
                    {execution.id.slice(0, 8)}...
                  </div>
                  <div className="text-xs text-gray-500">
                    {execution.completedAt
                      ? formatDate(execution.completedAt)
                      : "In Progress"}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {execution.workflowTitle}
                  </div>
                  <div className="text-xs text-gray-500">
                    {execution.workflowId.slice(0, 8)}...
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(execution.status)}`}
                  >
                    {execution.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {formatDate(execution.startedAt)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {formatDuration(execution.duration)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {execution.triggeredBy}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Link href={`/execution/${execution.id}`}>
                      <Button>View</Button>
                    </Link>
                    <Link href={`/workflow/${execution.workflowId}`}>
                      <Button variant="green">Workflow</Button>
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

const Executions = () => {
  return <Page />;
};

export default Executions;
