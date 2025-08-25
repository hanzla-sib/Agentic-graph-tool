
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { tool } from "@langchain/core/tools";

import { z } from "zod";
import { ChatOllama } from "@langchain/ollama";


const additionTool = tool(
  async ({ a, b }) => {
    return `The sum of ${a} and ${b} is ${a + b}`;
  },
  {
    name: "addition",
    description: "Use this tool for addition operations only.",
    schema: z.object({
      a: z.number().describe("The first number."),
      b: z.number().describe("The second number."),
    }),
  }
);

const subtractionTool = tool(
  async ({ a, b }) => {
    return `The difference between ${a} and ${b} is ${a - b}`;
  },
  {
    name: "subtraction",
    description: "Use this tool for subtraction operations only.",
    schema: z.object({
      a: z.number().describe("The first number."),
      b: z.number().describe("The second number."),
    }),
  }
);

const multiplicationTool = tool(
  async ({ a, b }) => {
    return `The product of ${a} and ${b} is ${a * b}`;
  },
  {
    name: "multiplication",
    description: "Use this tool for multiplication operations only.",
    schema: z.object({
      a: z.number().describe("The first number."),
      b: z.number().describe("The second number."),
    }),
  }
);

const divisionTool = tool(
  async ({ a, b }) => {
    if (b === 0) {
      return "Division by zero is not allowed.";
    }
    return `The quotient of ${a} and ${b} is ${a / b}`;
  },
  {
    name: "division",
    description: "Use this tool for division operations only.",
    schema: z.object({
      a: z.number().describe("The first number."),
      b: z.number().describe("The second number."),
    }),
  }
);

const llmFallback = tool(
  async ({ input }) => await llmForTool.call(input),
  {
    name: "llmFallback",
    description: "Fallback tool: use this for any question or operation not covered by other tools, including subtraction or other math.",
    schema: z.object({ input: z.string() }),
  }
);
const llmForTool = new ChatOllama({
  model: "llama3-groq-tool-use",
});

const agent = createReactAgent({
  llm: llmForTool,
  tools: [llmFallback, additionTool, subtractionTool, multiplicationTool, divisionTool],
});

const result = await agent.invoke({
  messages: [
    {
      role: "user",
      content: "You can use a tool if one is available. Otherwise, answer directly. what is 2 / 3",
    },
  ],
});

console.dir(result, { depth: null });