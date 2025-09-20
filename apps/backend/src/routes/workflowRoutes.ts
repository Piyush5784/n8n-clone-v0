import { PrismaClient } from "@repo/db/client";
import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { createWorkflow, updateWorkflowSchema, CustomNode } from "../types";

const router = Router();
const prisma = new PrismaClient();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    const workflows = await prisma.workflow.findMany({
      where: {
        userId,
      },
      include: {
        nodes: true,
      },
      orderBy: {
        title: "asc",
      },
    });

    // Format workflows for frontend
    const formattedWorkflows = workflows.map((workflow) => ({
      id: workflow.id,
      title: workflow.title,
      description: workflow.description,
      nodeCount: workflow.nodes.length,
    }));

    return res.json({
      message: "Workflows fetched successfully",
      workflows: formattedWorkflows,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching workflows:", error);
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Something went wrong",
      success: false,
    });
  }
});

router.get("/:workflowId", authMiddleware, async (req, res) => {
  try {
    const workflowId = req.params.workflowId;
    const userId = req.userId;

    const workflow = await prisma.workflow.findUnique({
      where: {
        id: workflowId,
        userId,
      },
      include: {
        nodes: true,
      },
    });

    if (!workflow) {
      return res.status(404).json({
        message: "Workflow not found",
        success: false,
      });
    }

    // Parse node data for frontend in customNode format
    const parsedNodes: CustomNode[] = workflow.nodes.map((node) => {
      const nodeData =
        typeof node.data === "string" ? JSON.parse(node.data) : node.data;
      return {
        id: nodeData.id || node.id,
        data: {
          label: nodeData.label,
          webhookId: nodeData.webhookId || "",
          metadata: node.metadata || null,
        },
        position: nodeData.position || { x: 0, y: 0 },
      };
    });

    const workflowData = {
      id: workflow.id,
      title: workflow.title,
      description: workflow.description,
      nodes: parsedNodes,
      edges: workflow.edges || [],
    };

    return res.json({
      message: "Workflow fetched successfully",
      workflow: workflowData,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching workflow:", error);
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Something went wrong",
      success: false,
    });
  }
});

router.post("/create", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId!;

    const parsedData = createWorkflow.safeParse(req.body);

    if (!parsedData.success) {
      console.log("INvalid data");
      return res.status(400).json({
        message: "Invalid data",
      });
    }

    const workflow = await prisma.workflow.create({
      data: {
        userId,
        title: parsedData.data.title,
        description: parsedData.data.description,
      },
    });

    return res.json({
      message: "Workflow successfully created",
      workflowId: workflow.id,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
});
router.post("/update", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId!;

    const parsedData = updateWorkflowSchema.safeParse(req.body);

    if (!parsedData.success) {
      return res.status(400).json({
        message: "Invalid data",
        success: false,
        errors: parsedData.error.issues,
      });
    }

    const data = parsedData.data;

    // Check if workflow exists and belongs to user
    const existingWorkflow = await prisma.workflow.findUnique({
      where: {
        id: data.workflowId,
        userId,
      },
    });

    if (!existingWorkflow) {
      return res.status(404).json({
        message: "Workflow not found",
        success: false,
      });
    }

    // Use Prisma transaction for update, delete, and create
    const [updateWorkflow] = await prisma.$transaction([
      prisma.workflow.update({
        where: {
          id: data.workflowId,
          userId,
        },
        data: {
          edges: data.edges,
        },
      }),
      prisma.node.deleteMany({
        where: {
          workflowId: data.workflowId,
        },
      }),
      ...(data.nodes && data.nodes.length > 0
        ? [
            prisma.node.createMany({
              data: data.nodes.map((node) => ({
                workflowId: data.workflowId,
                data: {
                  id: node.id,
                  label: node.data.label,
                  webhookId: node.data.webhookId,
                  position: {
                    x: node.position.x,
                    y: node.position.y,
                  },
                },
                id: node.id,
                metadata: null,
              })),
            }),
          ]
        : []),
    ]);

    return res.json({
      message: "Workflow updated successfully",
      success: true,
      workflow: updateWorkflow,
    });
  } catch (error) {
    console.error("Error updating workflow:", error);
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Internal server error",
      success: false,
    });
  }
});

router.delete("/:workflowId", authMiddleware, async (req, res) => {
  try {
    const workflowId = req.params.workflowId;
    const userId = req.userId;

    // Check if workflow exists and belongs to user
    const existingWorkflow = await prisma.workflow.findUnique({
      where: {
        id: workflowId,
        userId,
      },
    });

    if (!existingWorkflow) {
      return res.status(404).json({
        message: "Workflow not found",
        success: false,
      });
    }
    // Use a transaction to delete nodes and workflow atomically
    await prisma.$transaction([
      prisma.node.deleteMany({
        where: {
          workflowId: workflowId,
        },
      }),
      prisma.workflow.delete({
        where: {
          id: workflowId,
          userId,
        },
      }),
    ]);

    return res.json({
      message: "Workflow deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error deleting workflow:", error);
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Something went wrong",
      success: false,
    });
  }
});

// Route to update node metadata
router.post("/update-node-metadata", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId!;
    const { workflowId, nodeId, metadata } = req.body;

    console.log(req.body);

    if (!workflowId || !nodeId) {
      return res.status(400).json({
        message: "workflowId and nodeId are required",
        success: false,
      });
    }

    const workflow = await prisma.workflow.findUnique({
      where: {
        id: workflowId,
        userId,
      },
    });

    if (!workflow) {
      return res.status(404).json({
        message: "Workflow not found",
        success: false,
      });
    }

    const updated = await prisma.node.updateMany({
      where: {
        workflowId,
        id: nodeId,
      },
      data: {
        metadata,
      },
    });

    if (updated.count === 0) {
      return res.status(404).json({
        message: "Node not found in workflow",
        success: false,
      });
    }

    return res.json({
      message: "Node metadata updated successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error updating node metadata:", error);
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Internal server error",
      success: false,
    });
  }
});

export const workflowRoutes = router;
