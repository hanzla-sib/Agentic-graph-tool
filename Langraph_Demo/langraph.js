// agent.mt

import { TavilySearch } from "@langchain/tavily";
import { MemorySaver } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import dotenv from "dotenv";
import { ChatOllama } from "@langchain/ollama";
dotenv.config({ path: "../.env" });

// Define the tools for the agent to use
const agentTools = [new TavilySearch({
  apiKey: process.env.TAVILY_API_KEY, // store your key in an environment variable
  defaultParams: { max_results: 3 },
})];
const agentModel = new ChatOllama({
    model: "llama3.1",
    temperature: 0
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
    { messages: [new HumanMessage("Use your search tool to find the current weather in New York.")] },
    { configurable: { thread_id: "42" } },
  );

  console.log(
    agentFinalState.messages[agentFinalState.messages.length - 1].content,
  );
}

const agentNextState = await agent.invoke(
  { messages: [new HumanMessage("what about ny")] },
  { configurable: { thread_id: "42" } },
);

console.log(
  agentNextState.messages[agentNextState.messages.length - 1].content,
);

main().catch(console.error);
