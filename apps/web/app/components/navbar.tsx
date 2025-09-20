import React from "react";
import Link from "next/link";
import { Button } from "./Buttons";

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="text-xl font-bold text-gray-900">n8n Workflow</div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">Welcome back!</div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">U</span>
            </div>
            <Button variant="light" onClick={() => {}}>
              Settings
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
