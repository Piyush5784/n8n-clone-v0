import { z } from "zod";
import { generateText, tool } from "ai";
import { google } from "@ai-sdk/google";
import "dotenv/config";
import { ExecutionResult } from "./helper";

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
  const result = await generateText({
    model: google("gemini-2.0-flash"),
    tools: {
      sum: tool({
        description: "Get the sum",
        inputSchema: z.object({
          a: z.number(),
          b: z.number(),
        }),
        execute: async ({ a, b }: { a: number; b: number }) => ({
          result: a + b,
        }),
      }),
      product: tool({
        description: "Get the product",
        inputSchema: z.object({
          a: z.number(),
          b: z.number(),
        }),
        execute: async ({ a, b }: { a: number; b: number }) => ({
          result: a * b,
        }),
      }),
      power: tool({
        description: "Get the power",
        inputSchema: z.object({
          a: z.number(),
          b: z.number(),
        }),
        execute: async ({ a, b }: { a: number; b: number }) => ({
          result: a ** b,
        }),
      }),

      modules: tool({
        description: "Get the modulas",
        inputSchema: z.object({
          a: z.number(),
          b: z.number(),
        }),
        execute: async ({ a, b }: { a: number; b: number }) => ({
          result: a % b,
        }),
      }),
    },
    messages: [
      {
        content: "What is the sum,product,power and modules of 5 + 9?",
        role: "user",
      },
    ],
  });

  const processedResult = result.content
    .filter((c) => c.type == "tool-result")
    .map((c) => {
      if (c.type == "tool-result") {
        return {
          calculate: c.toolName,
          input: c.input,
          //@ts-ignore
          output: c.output.result,
        };
      }
    });

  //send an email
  console.log(processedResult);

  return {
    success: true,
  };
}
