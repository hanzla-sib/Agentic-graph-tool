import { StateGraph, END } from "@langchain/langgraph";
import { ChatOllama } from "@langchain/ollama";
import { HumanMessage } from "@langchain/core/messages";
import { ToolExecutor, ToolInvocation } from "@langchain/langgraph/prebuilt";
import { tools } from "../tools/tools.js";


// Initialize Ollama model
const model = new ChatOllama({
  model: "llama3", // Make sure this model is pulled in Ollama
  temperature: 0,
});

const toolExecutor = new ToolExecutor(tools); // this is tool executor to run the tools


// --- Functions for the graph ---

async function callModel(state) {
  const userMessage = state.messages[state.messages.length - 1];
  const response = await model.invoke([userMessage], { tools });
  return { agentResponse: response };
}