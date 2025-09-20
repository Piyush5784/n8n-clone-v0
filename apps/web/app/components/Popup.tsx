import React from "react";

interface PopupProps {
  open: boolean;
  onClose: () => void;
}

const Popup = ({ open, onClose }: PopupProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-md shadow-lg w-full max-w-md p-6">
        <div className="flex items-start">
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">
              Deactivate account
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to deactivate your account? All of your data
              will be permanently removed. This action cannot be undone.
            </p>
          </div>
        </div>
        <div className="mt-4 flex justify-end space-x-3">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-400"
            onClick={onClose}
          >
            Deactivate
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
