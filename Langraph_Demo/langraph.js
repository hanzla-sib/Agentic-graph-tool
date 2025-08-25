// agent.mt

import { TavilySearch } from "@langchain/tavily";
import { MemorySaver } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import dotenv from "dotenv";
import { ChatOllama } from "@langchain/ollama";
import { tool } from "@langchain/core/tools";
import { z } from "zod";

dotenv.config({ path: "../.env" });

const multiply = tool(
  ({ a, b }) => {
    console.log(`Multiply tool called with: a=${a}, b=${b}`);
    return a * b;
  },
  {
    name: "multiply",
    description: "Multiply two numbers",
    schema: z.object({
      a: z.number(),
      b: z.number(),
    }),
  }
);
// Define the tools for the agent to use
const agentTools = [
  new TavilySearch({
    apiKey: process.env.TAVILY_API_KEY, // store your key in an environment variable
    defaultParams: { max_results: 3 },
  }),
  multiply,
];
const agentModel = new ChatOllama({
  model: "llama3.1",
  temperature: 0,
});

// Initialize memory to persist state between graph runs
const agentCheckpointer = new MemorySaver();
const agent = createReactAgent({
  llm: agentModel,
  tools: agentTools,
  checkpointSaver: agentCheckpointer,
});

async function main() {
  const agentFinalState = await agent.invoke(
    {
      messages: [
        new HumanMessage(
          "Use your search tool to find the current weather in New York."
        ),
      ],
    },
    { configurable: { thread_id: "42" } }
  );

  console.log(
    agentFinalState.messages[agentFinalState.messages.length - 1].content
  );
}

const agentNextState = await agent.invoke(
  { messages: [new HumanMessage("Please multiply 4 and 2")] },
  { configurable: { thread_id: "42" } }
);

console.log(
  agentNextState.messages[agentNextState.messages.length - 1].content
);

main().catch(console.error);
