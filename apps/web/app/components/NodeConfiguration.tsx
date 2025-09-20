"use client";
import { useEffect, useState } from "react";
import { customNode } from "../workflow/[workflowId]/page";
import toast from "react-hot-toast";
import axios from "axios";
import { BACKEND_URL, TOKEN } from "../config";

// Node Configuration Modal Component
interface NodeConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  node: customNode | null;
  workflowId: string;
  onSave: (nodeId: string, configuration: any) => void;
}

export const NodeConfigurationModal: React.FC<NodeConfigurationModalProps> = ({
  isOpen,
  onClose,
  node,
  workflowId,
  onSave,
}) => {
  if (node?.data.label == "trigger" || node?.data.label == "webhook") {
    return null;
  }
  const [configuration, setConfiguration] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (node) {
      setConfiguration((node.data as any).metadata || {});
    }
  }, [node]);

  if (!isOpen || !node) return null;

  const handleSave = async () => {
    setLoading(true);
    try {
      // Make API call to save node metadata
      const response = await axios.post(
        `${BACKEND_URL}/workflow/update-node-metadata`,
        {
          workflowId: workflowId,
          nodeId: node.id,
          metadata: configuration,
        },
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );

      const responseData = response.data as {
        success: boolean;
        message?: string;
      };

      if (responseData.success) {
        await onSave(node.id, configuration);
        toast.success("Configuration saved successfully!");
      } else {
        throw new Error(responseData.message || "Failed to save configuration");
      }
    } catch (error) {
      console.error("Error saving configuration:", error);
      toast.error("Failed to save configuration");
    } finally {
      setLoading(false);
    }
  };

  const renderConfigurationFields = () => {
    switch (node.data.label) {
      //   case "trigger":
      //     return (
      //       <div className="space-y-4">
      //         <div>
      //           <label className="block text-sm font-medium text-gray-700 mb-2">
      //             Trigger Event
      //           </label>
      //           <select
      //             value={configuration.event || ""}
      //             onChange={(e) =>
      //               setConfiguration({ ...configuration, event: e.target.value })
      //             }
      //             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      //           >
      //             <option value="">Select trigger event</option>
      //             <option value="webhook">Webhook</option>
      //             <option value="schedule">Schedule</option>
      //             <option value="manual">Manual</option>
      //           </select>
      //         </div>
      //         {configuration.event === "schedule" && (
      //           <div>
      //             <label className="block text-sm font-medium text-gray-700 mb-2">
      //               Schedule (Cron Expression)
      //             </label>
      //             <input
      //               type="text"
      //               value={configuration.schedule || ""}
      //               onChange={(e) =>
      //                 setConfiguration({
      //                   ...configuration,
      //                   schedule: e.target.value,
      //                 })
      //               }
      //               placeholder="0 0 * * *"
      //               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      //             />
      //           </div>
      //         )}
      //       </div>
      //     );

      //   case "webhook":
      //     return (
      //       <div className="space-y-4">
      //         <div>
      //           <label className="block text-sm font-medium text-gray-700 mb-2">
      //             Webhook URL
      //           </label>
      //           <input
      //             type="url"
      //             value={configuration.url || ""}
      //             onChange={(e) =>
      //               setConfiguration({ ...configuration, url: e.target.value })
      //             }
      //             placeholder="https://api.example.com/webhook"
      //             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      //           />
      //         </div>
      //         <div>
      //           <label className="block text-sm font-medium text-gray-700 mb-2">
      //             HTTP Method
      //           </label>
      //           <select
      //             value={configuration.method || "POST"}
      //             onChange={(e) =>
      //               setConfiguration({ ...configuration, method: e.target.value })
      //             }
      //             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      //           >
      //             <option value="GET">GET</option>
      //             <option value="POST">POST</option>
      //             <option value="PUT">PUT</option>
      //             <option value="DELETE">DELETE</option>
      //           </select>
      //         </div>
      //         <div>
      //           <label className="block text-sm font-medium text-gray-700 mb-2">
      //             Headers (JSON)
      //           </label>
      //           <textarea
      //             value={configuration.headers || "{}"}
      //             onChange={(e) =>
      //               setConfiguration({
      //                 ...configuration,
      //                 headers: e.target.value,
      //               })
      //             }
      //             placeholder='{"Content-Type": "application/json"}'
      //             rows={3}
      //             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      //           />
      //         </div>
      //       </div>
      //     );

      case "sendEmail":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To Email
              </label>
              <input
                type="email"
                value={configuration.to || ""}
                onChange={(e) =>
                  setConfiguration({ ...configuration, to: e.target.value })
                }
                placeholder="recipient@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                value={configuration.subject || ""}
                onChange={(e) =>
                  setConfiguration({
                    ...configuration,
                    subject: e.target.value,
                  })
                }
                placeholder="Email subject"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message Body
              </label>
              <textarea
                value={configuration.body || ""}
                onChange={(e) =>
                  setConfiguration({ ...configuration, body: e.target.value })
                }
                placeholder="Email message content"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      case "sendTelegram":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chat ID
              </label>
              <input
                type="text"
                value={configuration.chatId || ""}
                onChange={(e) =>
                  setConfiguration({ ...configuration, chatId: e.target.value })
                }
                placeholder="Telegram chat ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                value={configuration.message || ""}
                onChange={(e) =>
                  setConfiguration({
                    ...configuration,
                    message: e.target.value,
                  })
                }
                placeholder="Message to send"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No configuration options available for this node type.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-800 opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Configure {node.data.label} Node
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              ×
            </button>
          </div>

          <div className="mb-6">
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Node Information
              </h3>
              <p className="text-sm text-gray-600">
                <strong>Type:</strong> {node.data.label}
              </p>
              <p className="text-sm text-gray-600">
                {/* <strong>ID:</strong> {node.id} */}
              </p>
            </div>

            {renderConfigurationFields()}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Configuration"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
