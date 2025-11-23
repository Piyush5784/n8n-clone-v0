"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL, TOKEN } from "../config";
import { Button } from "./Buttons";
import { toast } from "sonner";
import {
  AlignRight,
  ArrowRight,
  BookOpenCheck,
  MoveRightIcon,
  X,
} from "lucide-react";

interface Execution {
  id: string;
  status: "Failed" | "Processing" | "Success";
  failedReason?: string;
  workflowId: string;
  createdAt: Date;
}

interface WorkflowSidebarProps {
  workflowId: string;
  createdAt?: string;
  updatedAt?: string;
}

export const WorkflowSidebar = ({ workflowId }: WorkflowSidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Fetch executions when sidebar opens or workflowId changes
  useEffect(() => {
    if (isOpen && workflowId) {
      fetchExecutions();
    }
  }, [isOpen, workflowId]);

  const fetchExecutions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BACKEND_URL}/executions/${workflowId}`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );

      const data = response.data as { executions?: Execution[] };
      if (data.executions) {
        setExecutions(data.executions);
      }
    } catch (error) {
      console.error("Error fetching executions:", error);
      toast.error("Failed to fetch executions");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Execution["status"]) => {
    switch (status) {
      case "Success":
        return "bg-green-400";
      case "Failed":
        return "bg-red-400";
      case "Processing":
        return "bg-yellow-400";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusText = (status: Execution["status"]) => {
    switch (status) {
      case "Success":
        return "text-green-600";
      case "Failed":
        return "text-red-600";
      case "Processing":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <>
      {/* Toggle Button - Fixed position */}
      <Button
        onClick={toggleSidebar}
        className={`fixed top-1/2 z-50 p-0 rounded-none rounded-r-lg shadow-2xl transition-all duration-300 ease-in-out transform -translate-y-1/2 ${
          isOpen ? "left-96" : "left-0"
        }`}
      >
        <svg
          className={`w-5 h-5 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </Button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 h-full overflow-y-scroll w-96 bg-white border-r border-gray-200 shadow-xl z-40 transition-all duration-300 ease-in-out transform ${
          isOpen ? "left-0" : "-left-96"
        }`}
      >
        {/* Sidebar Header */}
        <div className="bg-gray-50 border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Workflow Details
              </h2>
              <p className="text-sm text-gray-500 mt-1">ID: {workflowId}</p>
            </div>
            <Button
              variant={"ghost"}
              onClick={toggleSidebar}
              // className="p-2 hover:bg-gray-200 rounded-lg transition-colors duration-200"
            >
              <X />
            </Button>
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Workflow Info Section */}
            <div>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Status:</span>
                  <span className="text-green-600 font-medium">Active</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Created:</span>
                  <span className="text-gray-800">Today</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Last Modified:</span>
                  <span className="text-gray-800">2 min ago</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Statistics
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {executions.length}
                  </div>
                  <div className="text-xs text-blue-500">Total Runs</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {executions.length > 0
                      ? Math.round(
                          (executions.filter((e) => e.status === "Success")
                            .length /
                            executions.length) *
                            100
                        )
                      : 0}
                    %
                  </div>
                  <div className="text-xs text-green-500">Success Rate</div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {executions.filter((e) => e.status === "Processing").length}
                  </div>
                  <div className="text-xs text-yellow-500">Running</div>
                </div>
                <div className="bg-red-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {executions.filter((e) => e.status === "Failed").length}
                  </div>
                  <div className="text-xs text-red-500">Failed</div>
                </div>
              </div>
            </div>
            {/* Quick Actions Section */}
            {/* <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 text-blue-500 mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <span className="text-sm font-medium">View Logs</span>
                  </div>
                </button>

                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 text-green-500 mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    <span className="text-sm font-medium">Analytics</span>
                  </div>
                </button>

                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 text-purple-500 mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span className="text-sm font-medium">Settings</span>
                  </div>
                </button>
              </div>
            </div> */}

            {/* Recent Activity Section */}
            <div>
              <div className="text-sm font-medium text-gray-900 mb-3">
                Recent Activity
              </div>
              {loading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              ) : executions.length > 0 ? (
                <div className="space-y-3">
                  {executions.map((execution) => (
                    <div
                      key={execution.id}
                      className="flex items-start space-x-3"
                    >
                      <div
                        className={`w-2 h-2 ${getStatusColor(execution.status)} rounded-full mt-2 flex-shrink-0`}
                      ></div>
                      <div>
                        <p
                          className={`text-sm ${getStatusText(execution.status)} font-medium`}
                        >
                          Execution {execution.status.toLowerCase()}
                        </p>
                        {execution.failedReason && (
                          <p className="text-xs text-red-500 mt-1">
                            {execution.failedReason}
                          </p>
                        )}
                        <p className="text-xs text-gray-500">
                          {new Date(execution.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">No executions found</p>
                </div>
              )}
            </div>

            {/* Statistics Section - Updated with execution stats */}
          </div>
        </div>
      </div>

      {/* Overlay when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-800 opacity-50 z-30 transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};
