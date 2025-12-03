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
import { BACKEND_URL } from "@/config";
import Credentials from "@/components/Credentials";
import { useParams } from "next/navigation";
import { NodeConfigurationModal } from "@/components/NodeConfiguration";
import axios from "axios";
import { v4 } from "uuid";
import ExecuteButton from "@/components/ExecuteButton";
import Link from "next/link";
import { WorkflowSidebar } from "@/components/WorkflowSidebar";
import { AvailableWebhook, CustomNode, hookType } from "@repo/types";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { fetchWebhooks, NodeAdd, SaveWorkflow } from "./function";
import { AvailableWebhooks } from "@/components/Availabel-webhook";

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

  const { token } = useAuth();

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

          console.log("Workflow response:", response.data);

          console.log(response.data);
          const data = response.data as { success?: boolean; workflow?: any };
          if (data.success && data.workflow) {
            const workflowData = data.workflow;

            if (workflowData.nodes && Array.isArray(workflowData.nodes)) {
              setNodes(workflowData.nodes);
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

  function addNode(type: hookType, webhookId: string) {
    NodeAdd({ nodes, setNodes, type, webhookId });
  }

  async function onSave() {
    if (!token) return;
    await SaveWorkflow({ workflowId, nodes, edges, token });
  }

  if (!token) {
    return <div>loading</div>;
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
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Get started with your workflow
                </p>
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
          <AvailableWebhooks
            avaliableWebhook={avaliableWebhook}
            addNode={addNode}
          />
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
