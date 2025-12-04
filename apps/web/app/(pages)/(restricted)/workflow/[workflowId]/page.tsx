/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";
import { useState, useCallback, useEffect } from "react";
import {
  ReactFlow,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  type Node,
  type Edge,
  type FitViewOptions,
  type OnConnect,
  type OnNodesChange,
  type OnEdgesChange,
  type DefaultEdgeOptions,
  Background,
  Controls,
  MiniMap,
} from "@xyflow/react";
//@ts-expect-error
import "@xyflow/react/dist/style.css";
import { Button } from "@/components/ui/button";
import { BACKEND_URL } from "@/config";
import Credentials from "@/components/Credentials";
import { useParams } from "next/navigation";
import { NodeConfigurationModal } from "@/components/NodeConfiguration";
import axios from "axios";
import ExecuteButton from "@/components/ExecuteButton";
import Link from "next/link";
import { WorkflowSidebar } from "@/components/WorkflowSidebar";
import { AvailableWebhook } from "@repo/types";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { fetchWebhooks, SaveWorkflow } from "./function";
import { AvailableWebhooks } from "@/components/Availabel-webhook";
import {
  CustomNodeTypes,
  nodeTypes,
  CustomNodes,
  nodeIcons,
  getNodeDescription,
} from "./CustomNode";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

const fitViewOptions: FitViewOptions = {
  padding: 0.2,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
  animated: true,
};

function Flow() {
  const { workflowId } = useParams<{ workflowId: string }>();
  const { token } = useAuth();

  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [, setSelectedNodeId] = useState<string>("");
  const [, setSelectedNodeType] = useState<CustomNodeTypes>("webhook");
  const [nodeIdCounter, setNodeIdCounter] = useState(1);

  const [avaliableWebhook, setAvliableWebhooks] = useState<AvailableWebhook[]>(
    []
  );

  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [selectedNodeForConfig, setSelectedNodeForConfig] =
    useState<Node | null>(null);

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      setSelectedNodeId(node.id);
      const nodeData = node.data as {
        label: CustomNodeTypes;
      };
      setSelectedNodeType(nodeData.label);

      const customNode = nodes.find((n) => n.id === node.id);
      if (customNode) {
        setSelectedNodeForConfig(customNode);
        setIsConfigModalOpen(true);
      }
    },
    [nodes]
  );

  useEffect(() => {
    if (workflowId && token) {
      async function fetchWorkflow() {
        try {
          const response = await axios.get(
            `${BACKEND_URL}/workflow/${workflowId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data = response.data as { success?: boolean; workflow?: any };
          if (data.success && data.workflow) {
            const workflowData = data.workflow;

            if (workflowData.nodes && Array.isArray(workflowData.nodes)) {
              // Ensure all nodes have type: "custom"
              const normalizedNodes = workflowData.nodes.map((node: Node) => ({
                ...node,
                type: node.type || "custom", // Set type to "custom" if not already set
              }));
              setNodes(normalizedNodes);
              // Set counter to max node ID + 1
              const maxId = Math.max(
                ...workflowData.nodes.map((n: Node) => parseInt(n.id) || 0),
                0
              );
              setNodeIdCounter(maxId + 1);
            }

            if (workflowData.edges && Array.isArray(workflowData.edges)) {
              setEdges(workflowData.edges);
            } else if (workflowData.edges) {
              try {
                const parsedEdges =
                  typeof workflowData.edges === "string"
                    ? JSON.parse(workflowData.edges)
                    : workflowData.edges;
                setEdges(Array.isArray(parsedEdges) ? parsedEdges : []);
              } catch (error) {
                console.error("Error parsing edges:", error);
                setEdges([]);
              }
            }
          } else {
            toast.error("Failed to fetch workflow");
          }
        } catch (error) {
          console.error("Error fetching workflow:", error);
          toast.error("Error fetching workflow. Please try again.");
        }
      }
      fetchWorkflow();
    }
  }, [workflowId, token]);

  useEffect(() => {
    if (!token) return;
    fetchWebhooks({ token, setAvliableWebhooks });
  }, [token]);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    []
  );

  const addNode = (type: CustomNodeTypes, webhookId?: string) => {
    const newNode = {
      id: String(nodeIdCounter),
      type: "custom",
      data: { label: type, webhookId: webhookId || "" },
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 400 + 100,
      },
    };
    setNodes((nds) => [...nds, newNode]);
    setNodeIdCounter((id) => id + 1);
  };

  async function onSave() {
    if (!token) return;
    await SaveWorkflow({ workflowId, nodes, edges, token });
  }

  if (!token) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!workflowId) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Workflow ID Required</CardTitle>
            <CardDescription>
              Please provide a valid workflow ID to continue.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <WorkflowSidebar workflowId={workflowId} />

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={"/dashboard"}>
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Workflow Builder
            </h1>
            <p className="text-sm text-gray-500">ID: {workflowId}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={"/dashboard"}>Dashboard</Link>
          </Button>
          <Button onClick={onSave}>Save</Button>
          <ExecuteButton workflowId={workflowId} />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Canvas */}
        <div className="flex-1 relative">
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80 z-10">
              <Card className="max-w-md">
                <CardHeader className="text-center">
                  <CardTitle>Get started with your workflow</CardTitle>
                  <CardDescription>
                    Add your first node to begin building
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={() => addNode("trigger")}
                    variant="default"
                    className="w-full"
                  >
                    <span className="mr-2">⚡</span>
                    Add Trigger
                  </Button>
                  <Button
                    onClick={() => addNode("webhook")}
                    variant="outline"
                    className="w-full"
                  >
                    <span className="mr-2">🔗</span>
                    Add Webhook
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            fitView
            fitViewOptions={fitViewOptions}
            defaultEdgeOptions={defaultEdgeOptions}
            className="bg-gray-50"
          >
            <Background />
            <MiniMap />
            <Controls />
          </ReactFlow>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-white border-l border-gray-200 shadow-lg overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Add Nodes
            </h3>
            <div className="space-y-2">
              {CustomNodes.map((nodeType: CustomNodeTypes, idx: number) => {
                const Icon = nodeIcons[nodeType];
                return (
                  <div
                    key={idx}
                    onClick={() => addNode(nodeType)}
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-green-500 hover:bg-green-50 cursor-pointer transition-all duration-200 group"
                  >
                    <div className="bg-green-50 p-2 rounded-lg group-hover:bg-green-100 transition-colors">
                      <Icon className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800 capitalize">
                        {nodeType === "sendAndAwait"
                          ? "Send & Await"
                          : nodeType}
                      </p>
                      <p className="text-xs text-gray-500">
                        {getNodeDescription(nodeType)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <Card className="mt-6 bg-green-50 border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-green-900">
                  💡 Quick Tip
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-green-700 pt-0">
                Click any node to configure it. Connect nodes by dragging from
                the bottom handle to the top handle of another node.
              </CardContent>
            </Card>
          </div>

          {avaliableWebhook.length > 0 && (
            <div className="border-t border-gray-200 p-4">
              <AvailableWebhooks
                avaliableWebhook={avaliableWebhook}
                addNode={addNode}
              />
            </div>
          )}

          <div className="border-t border-gray-200">
            <Credentials />
          </div>
        </div>
      </div>

      {/* Node Configuration Modal */}
      <NodeConfigurationModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        node={selectedNodeForConfig}
        workflowId={workflowId}
        onSave={(nodeId, configuration) => {
          setNodes((prevNodes) =>
            prevNodes.map((node) =>
              node.id === nodeId
                ? { ...node, data: { ...node.data, metadata: configuration } }
                : node
            )
          );
          setIsConfigModalOpen(false);
          toast.success("Node configuration saved!");
        }}
      />
    </div>
  );
}

export default Flow;
