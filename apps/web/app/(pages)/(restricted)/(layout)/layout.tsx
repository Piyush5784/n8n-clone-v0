"use client";
import { Button } from "@repo/ui/button";
import React, { ReactNode, useState } from "react";
import CreateWorkflowForm from "@/components/CreateWorkflowForm";
import Sidebar from "@/components/sidebar";

const Page = ({ children }: { children: ReactNode }) => {
  const [openCreateModal, setOpenCreateModal] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden md:block">
          <Sidebar />
        </div>

        <div className="flex-1 flex flex-col p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Workflows</h1>
              <p className="text-gray-600 mt-1">
                Manage and create your automation workflows
              </p>
            </div>
            <Button variant="dark" onClick={() => setOpenCreateModal(true)}>
              ✨ Create Workflow
            </Button>
          </div>

          <div className="flex-1 overflow-auto">{children}</div>
        </div>
      </div>

      {openCreateModal && (
        <div className="fixed inset-0 z-50 flex justify-center items-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpenCreateModal(false)}
          />

          <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <CreateWorkflowForm
              isOpen={openCreateModal}
              onClose={() => setOpenCreateModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
