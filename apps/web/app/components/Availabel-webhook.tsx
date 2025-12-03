import { webhookType } from "@/helpers/function";
import { AvailableWebhook, hookType } from "@repo/types";
import React from "react";

export const AvailableWebhooks = ({
  avaliableWebhook,
  addNode,
}: {
  avaliableWebhook: AvailableWebhook[];
  addNode: (type: hookType, webhookId: string) => void;
}) => {
  return (
    <div>
      {" "}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">
            Available Services
          </h3>

          {avaliableWebhook.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">Loading services...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {avaliableWebhook
                .filter(
                  (hook) => hook.type !== "trigger" && hook.type !== "webhook"
                )
                .map((hook) => (
                  <div
                    key={hook.id}
                    className="group p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm cursor-pointer transition-all duration-200 bg-white hover:bg-blue-50"
                    onClick={() => {
                      const ndeType = webhookType(hook) as hookType;
                      addNode(ndeType, hook.id);
                    }}
                  >
                    <div className="flex items-center">
                      <div className="shrink-0 mr-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={hook.image}
                          alt={hook.type}
                          className="w-8 h-8 rounded object-cover"
                        />
                        <span className="text-xl hidden">{hook.type}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 group-hover:text-blue-900">
                          {hook.type || hook.id}
                        </p>
                        <p className="text-xs text-gray-500">
                          Click to add to workflow
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvailableWebhooks;
