"use client";
import { Button } from "@repo/ui/button";
import React, { useState } from "react";
import CreateWorkflowForm from "../../components/CreateWorkflowForm";
import Sidebar from "../../components/sidebar";
import Navbar from "../../components/navbar";

const Page = () => {
  const [openCreateModal, setOpenCreateModal] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Workflows</h1>
              <p className="text-gray-600 mt-1">
                Manage and create your automation workflows
              </p>
            </div>
            <Button variant="default" onClick={() => setOpenCreateModal(true)}>
              + Create Workflow
            </Button>
          </div>

          {/* Workflows Content */}
          <div className="flex-1 bg-white rounded-lg shadow-sm border p-6">
            <div className="text-center text-gray-500 mt-8">
              <div className="mb-4">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No workflows yet
              </h3>
              <p className="text-gray-500 mb-4">
                Get started by creating your first workflow
              </p>
              <Button
                variant="default"
                onClick={() => setOpenCreateModal(true)}
              >
                Create your first workflow
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal open={openCreateModal} setOpen={setOpenCreateModal} />
    </div>
  );
};

const Modal = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-800 opacity-50 transition-opacity"
        onClick={() => setOpen(false)}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <CreateWorkflowForm isOpen={open} onClose={() => setOpen(false)} />
      </div>
    </div>
  );
};

export default Page;
