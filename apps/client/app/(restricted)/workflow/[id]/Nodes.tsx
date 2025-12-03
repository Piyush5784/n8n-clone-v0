"use client";
import React, { useState, useCallback, memo } from "react";
import {
  ReactFlow,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Background,
  Controls,
  MiniMap,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  Node,
  Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CustomNodeTypes,
  nodeTypes,
  CustomNodes,
  nodeIcons,
  getNodeDescription,
} from "@/components/custom/nodes";

function Nodes() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [nodeIdCounter, setNodeIdCounter] = useState(6);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const addNode = (type: CustomNodeTypes) => {
    const newNode = {
      id: String(nodeIdCounter),
      type: "custom",
      data: { label: type, webhookId: "" },
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 400 + 100,
      },
    };
    setNodes((nds) => [...nds, newNode]);
    setNodeIdCounter((id) => id + 1);
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Workflow Builder
            </h1>
            <p className="text-sm text-gray-500">
              Create beautiful automation workflows
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors">
            Cancel
          </Button>
          <Button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm">
            Save Workflow
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitViewOptions={{ padding: 0.2 }}
            className="bg-gray-50"
          >
            <Background />
            <MiniMap />
            <Controls />
          </ReactFlow>
        </div>

        <div className="w-64 bg-white border-l border-gray-200 shadow-2xl p-4 overflow-y-auto">
          <p
            onClick={() => addNode("AiAgent")}
            className="text-sm font-semibold text-gray-700 mb-3"
          >
            Add Nodes
          </p>
          <div className="space-y-2">
            {CustomNodes.map((c, idx) => {
              return (
                <div
                  key={idx}
                  onClick={() => addNode(c)}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all duration-200 group"
                >
                  <div className="bg-blue-100 p-2 rounded-lg group-hover:bg-blue-200 transition-colors">
                    {React.createElement(nodeIcons[c], {
                      className: "w-4 h-4 ",
                    })}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 capitalize">
                      {c}
                    </p>
                    <p className="text-xs text-gray-500">
                      {getNodeDescription(c)}{" "}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-sm text-blue-900 mb-2">
              💡 Quick Tip
            </h4>
            <p className="text-xs text-blue-700">
              Click any node to configure it. Connect nodes by dragging from the
              bottom handle to the top handle of another node.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Nodes;
