import { hookType, hookTypesArr } from "@repo/types";
import { NodeTypes, Handle, NodeProps } from "@xyflow/react";
import { Position } from "@xyflow/system";
import {
  Zap,
  Webhook,
  Mail,
  MessageCircle,
  Sparkles,
  Settings,
  Trash2,
} from "lucide-react";
import { JSX, memo } from "react";

export const nodeIcons = {
  trigger: Zap,
  webhook: Webhook,
  sendEmail: Mail,
  sendTelegram: MessageCircle,
  AiAgent: Sparkles,
  sendAndAwait: Mail,
};

const CustomNode = memo(({ data, selected }: NodeProps): JSX.Element => {
  const type = data.label;
  const Icon = nodeIcons[type as CustomNodeTypes];

  return (
    <div
      className={`
        relative bg-white rounded-xl text-black shadow-lg border-2 
        transition-all duration-200 hover:shadow-2xl group
        ${selected ? `border-black scale-105` : "border-gray-500"}
        min-w-[200px]
      `}
    >
      <div className={` rounded-t-lg p-3 text-black`}>
        <div className="flex items-center gap-2">
          <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm">
            <Icon className="w-4 h-4" />
          </div>
          <span className="font-semibold text-sm capitalize">
            {type === "sendAndAwait"
              ? "Send & Await"
              : (type as CustomNodeTypes)}
          </span>
        </div>
      </div>

      <div className="p-4 border-t border-black">
        <div className={`border rounded-lg p-3 mb-2`}>
          <p className={`text-xs font-medium`}>
            {type === "trigger" && "Workflow trigger"}
            {type === "webhook" && "HTTP endpoint"}
            {type === "sendEmail" && "Email notification"}
            {type === "sendTelegram" && "Telegram message"}
            {type === "AiAgent" && "AI processing"}
            {type === "sendAndAwait" && "Email with reply wait"}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Active</span>
        </div>
      </div>

      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="bg-white/90 p-1 rounded hover:bg-white shadow-sm">
          <Settings size={14} className=" text-gray-600" />
        </button>
        <button
          className="bg-white/90 p-1 rounded hover:bg-white shadow-sm"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Trash2 size={14} className=" text-red-500" />
        </button>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-gray-400 border-2 border-black"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-gray-400 border-2 border-black"
      />
    </div>
  );
});

CustomNode.displayName = "CustomNode";

export const nodeTypes: NodeTypes = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  custom: CustomNode as any,
};

export const CustomNodes: CustomNodeTypes[] = hookTypesArr;
export type CustomNodeTypes = hookType;

export const getNodeDescription = (nodeType: CustomNodeTypes): string => {
  const descriptions: Record<CustomNodeTypes, string> = {
    trigger: "Start your workflow",
    sendAndAwait: "Send email and wait for reply",
    webhook: "Receive HTTP requests",
    sendEmail: "Send email notifications",
    sendTelegram: "Send Telegram messages",
    AiAgent: "AI-powered processing",
  };
  return descriptions[nodeType];
};
