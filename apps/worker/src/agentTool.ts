import { z } from "zod";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { tool } from "@langchain/core/tools";
import { AIMessage, ToolMessage } from "@langchain/core/messages";
import "dotenv/config";
import { ExecutionResult } from "./helper";

const sum = tool(
  //@ts-ignore
  async (input) => {
    return input.a + input.b;
  },
  {
    name: "sum",
    description: "Get the sum of two numbers",
    schema: z.object({
      a: z.number().describe("The first number"),
      b: z.number().describe("The second number"),
    }),
  }
);

const product = tool(
  //@ts-ignore
  async (input) => {
    return input.a * input.b;
  },
  {
    name: "product",
    description: "Get the product of two numbers",
    schema: z.object({
      a: z.number().describe("The first number"),
      b: z.number().describe("The second number"),
    }),
  }
);

const power = tool(
  //@ts-ignore
  async (input) => {
    return input.a ** input.b;
  },
  {
    name: "power",
    description: "Get the power of a number",
    schema: z.object({
      a: z.number().describe("The base number"),
      b: z.number().describe("The exponent"),
    }),
  }
);

const modules = tool(
  //@ts-ignore
  async (input) => {
    return input.a % input.b;
  },
  {
    name: "modules",
    description: "Get the modulus of two numbers",
    schema: z.object({
      a: z.number().describe("The dividend"),
      b: z.number().describe("The divisor"),
    }),
  }
);

// Initialize the model
const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
  temperature: 0,
});

// Create the agent
const agent = createReactAgent({
  llm: model,
  tools: [sum, product, power, modules],
});

export async function execute(
  var1: string,
  var2: string
): Promise<ExecutionResult> {
  if (!var1 || !var2) {
    return {
      success: false,
      failedReason: "one of the variable is missing",
    };
  }

  const result = await agent.invoke({
    messages: [
      {
        role: "user",
        content: `First calculate ${var1} + ${var2}, then multiply the result by 2, then raise it to the power of 2`,
      },
    ],
  });

  const processedResult = {
    messages: result.messages
      .map((msg) => {
        if (
          msg instanceof AIMessage &&
          msg.tool_calls &&
          msg.tool_calls.length > 0
        ) {
          return {
            //@ts-ignore
            operation: msg.tool_calls[0].name,

            //@ts-ignore
            input: msg.tool_calls[0].args,
            answer: null,
          };
        } else if (msg instanceof ToolMessage) {
          // Tool Message with result
          return {
            operation: msg.name,
            input: null,
            answer: msg.content,
          };
        } else if (msg.content && typeof msg.content === "string") {
          // Final AI response
          return {
            operation: "final_answer",
            input: null,
            answer: msg.content,
          };
        }
        return {
          operation: "user_input",
          input: msg.content,
          answer: null,
        };
      })
      .filter(Boolean),
  };

  console.log(processedResult);

  return {
    success: true,
    successResponse: processedResult,
  };
}
