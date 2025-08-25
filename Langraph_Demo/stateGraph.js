import { TavilySearch } from "@langchain/tavily";
import {
  MemorySaver,
  MessagesAnnotation,
  StateGraph,
} from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";
import { createReactAgent, ToolNode } from "@langchain/langgraph/prebuilt";
import dotenv from "dotenv";
import { ChatOllama } from "@langchain/ollama";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { RunnableSequence } from "@langchain/core/runnables";

// Define the tools for the agent to use
const agentModel = new ChatOllama({
  model: "llama3.1",
  temperature: 0,
});

// Define the function that determines whether to continue or not
function shouldContinue({ messages }) {
  const lastMessage = messages[messages.length - 1];

  // If the LLM makes a tool call, then we route to the "tools" node
  if (lastMessage.tool_calls?.length) {
    return "tools";
  }
  // Otherwise, we stop (reply to the user) using the special "__end__" node
  return "__end__";
}

// Define the function that calls the model
async function callModel(state) {
  const response = await agentModel.invoke(state.messages);

  // We return a list, because this will get added to the existing list
  return { messages: [response] };
}

// Define a new graphs
const workflow = new StateGraph(MessagesAnnotation)
  .addNode("agent", callModel)
  .addEdge("__start__", "agent") // __start__ is a special name for the entrypoint
  .addNode("tools", ToolNode)
  .addEdge("tools", "agent")
  .addConditionalEdges("agent", shouldContinue);

const app = workflow.compile();

const finalState = await app.invoke({
  messages: [new HumanMessage("what is the weather in sf")],
});
console.log(finalState.messages[finalState.messages.length - 1].content);

const nextState = await app.invoke({
  // Including the messages from the previous run gives the LLM context.
  // This way it knows we're asking about the weather in NY
  messages: [
    ...finalState.messages,
    new HumanMessage("multiply 2 and 3 using multiply tool"),
  ],
});
console.log(nextState.messages[nextState.messages.length - 1].content);
