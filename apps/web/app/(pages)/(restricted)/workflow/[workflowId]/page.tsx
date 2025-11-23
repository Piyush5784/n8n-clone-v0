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
import "@xyflow/react/dist/style.css";
import { Button } from "@/components/Buttons";
import { getWebhooks, webhookType } from "@/helpers/function";
import { BACKEND_URL, TOKEN } from "@/config";
import Credentials from "@/components/Credentials";
import { useParams } from "next/navigation";
import { NodeConfigurationModal } from "@/components/NodeConfiguration";
import axios from "axios";
import { v4 } from "uuid";
import ExecuteButton from "@/components/ExecuteButton";
import Link from "next/link";
import { WorkflowSidebar } from "@/components/WorkflowSidebar";
import { AvailableWebhook, CustomNode, hookType } from "@repo/types";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const initialNodes: CustomNode[] = [];
const initialEdges: Edge[] = [];

const fitViewOptions: FitViewOptions = {
  padding: 0.2,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
  animated: true,
};

function Flow() {
  const { workflowId } = useParams<{ workflowId: string }>();

  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string>("");
  const [selectedNodeType, setSelectedNodeType] = useState<
    "trigger" | "webhook" | "sendEmail" | "sendTelegram" | "AiAgent"
  >("webhook");
  const [avaliableWebhook, setAvliableWebhooks] = useState<AvailableWebhook[]>(
    []
  );
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [selectedNodeForConfig, setSelectedNodeForConfig] =
    useState<CustomNode | null>(null);
  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      setSelectedNodeId(node.id);
      const nodeData = node.data as {
        label: "trigger" | "webhook" | "sendEmail" | "sendTelegram" | "AiAgent";
      };
      setSelectedNodeType(nodeData.label);

      const customNode = nodes.find((n) => n.id === node.id);
      if (customNode) {
        setSelectedNodeForConfig(customNode as CustomNode);
        setIsConfigModalOpen(true);
      }
    },
    [nodes]
  );

  useEffect(() => {
    if (workflowId) {
      async function fetchWorkflow() {
        try {
          const response = await axios.get(
            `${BACKEND_URL}/workflow/${workflowId}`,
            {
              headers: {
                Authorization: `Bearer ${TOKEN}`,
              },
            }
          );

          console.log("Workflow response:", response.data);

          console.log(response.data);
          const data = response.data as { success?: boolean; workflow?: any };
          if (data.success && data.workflow) {
            const workflowData = data.workflow;

            // Set nodes in customNode format
            if (workflowData.nodes && Array.isArray(workflowData.nodes)) {
              setNodes(workflowData.nodes);
            }

            // Set edges
            if (workflowData.edges && Array.isArray(workflowData.edges)) {
              setEdges(workflowData.edges);
            } else if (workflowData.edges) {
              // If edges is stored as JSON, parse it
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
  }, [workflowId]);

  useEffect(() => {
    async function fetchWebhooks() {
      try {
        const data = await getWebhooks();
        const webhooks =
          (data as { webhooks?: AvailableWebhook[] }).webhooks || [];

        setAvliableWebhooks(webhooks);
      } catch (error) {
        console.error("Error fetching webhooks:", error);
        toast.error("Failed to fetch available services");
      }
    }
    fetchWebhooks();
  }, []);

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

  function addNode(type: hookType, webhookId: string) {
    // Check if this is the first node and enforce trigger/webhook rule
    if (nodes.length === 0 && type !== "trigger" && type !== "webhook") {
      toast.error("First node must be trigger or webhook");
      return;
    }

    // Check if user is trying to add multiple trigger/webhook nodes
    if (nodes.length > 0 && (type === "trigger" || type === "webhook")) {
      const hasInitialNode = nodes.some(
        (node) => node.data.label === "trigger" || node.data.label === "webhook"
      );
      if (hasInitialNode) {
        toast.error(
          "You can only have one trigger or webhook as the first node"
        );
        return;
      }
    }

    // // Add AiAgent to available webhooks if not present
    // if (
    //   type === "AiAgent" &&
    //   !avaliableWebhook.some((hook) => hook.type === "AiAgent")
    // ) {
    //   // Handle AiAgent node creation
    // }

    const data: CustomNode = {
      id: v4(),
      data: { label: type, webhookId },
      position: {
        x: 0,
        y: 100,
      },
    };
    setNodes((n) => [...n, data]);
    toast.success(`${type} node added successfully`);
  }

  async function onSave() {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/workflow/update`,
        {
          workflowId,
          nodes,
          edges,
        },
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );

      const data = response.data as { success?: boolean };
      if (data.success) {
        toast.success("Workflow saved successfully!");
      } else {
        toast.error("Failed to save workflow");
      }
    } catch (error) {
      console.error("Error saving workflow:", error);
      toast.error("Error saving workflow. Please try again.");
    }
  }

  if (!workflowId) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Workflow ID Required
          </h2>
          <p className="text-gray-600">
            Please provide a valid workflow ID to continue.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50">
      <WorkflowSidebar workflowId={workflowId} />
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-semibold text-gray-800">
          <Button className="mx-3" asChild variant={"outline"}>
            <Link href={"/dashboard"}>
              {" "}
              <ArrowLeft />
            </Link>
          </Button>
          Workflow Builder
          <span className="text-sm text-gray-500 ml-2">ID: {workflowId}</span>
        </div>
        <div className="flex gap-3">
          <Link href={"/dashboard"}>
            <Button variant="outline">Go to dashboard</Button>
          </Link>
          <Button variant="default" onClick={onSave} className="px-6 py-2">
            Save
          </Button>
          <ExecuteButton workflowId={workflowId} />
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        <div className="flex-1 relative">
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80 z-10">
              <div className="text-center bg-white p-8 rounded-lg shadow-lg border border-gray-200">
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
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Get started with your workflow
                </h3>
                <p className="text-gray-500 mb-6">
                  Add your first node to begin building
                </p>
                <div className="space-y-3">
                  <Button
                    onClick={() => addNode("trigger", "")}
                    variant="default"
                    className="w-full justify-center"
                  >
                    <span className="mr-2">⚡</span>
                    Add Trigger
                  </Button>
                  <Button
                    onClick={() => addNode("webhook", "")}
                    variant="default"
                    className="w-full justify-center"
                  >
                    <span className="mr-2">🔗</span>
                    Add Webhook
                  </Button>
                </div>
              </div>
            </div>
          )}

          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            // onNodeDrag={onNodeDrag}
            onNodeClick={onNodeClick}
            fitView
            fitViewOptions={fitViewOptions}
            defaultEdgeOptions={defaultEdgeOptions}
          >
            <Background />
            <MiniMap />
            <Controls />
          </ReactFlow>
        </div>

        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          {/* <div className="p-6 border-b border-gray-200">
            <div className="relative"> */}
          {/* <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                ...
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search services..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              /> */}
          {/* </div> */}
          {/* </div> */}

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
                      (hook) =>
                        hook.type !== "trigger" && hook.type !== "webhook"
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
                          <div className="flex-shrink-0 mr-3">
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

          <Credentials />
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
