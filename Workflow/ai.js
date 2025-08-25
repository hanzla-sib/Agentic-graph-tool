import { StateGraph, END } from "@langchain/langgraph";
import { ChatOllama } from "@langchain/ollama";
import { HumanMessage, AIMessage, ToolMessage } from "@langchain/core/messages";
import { ToolExecutor } from "@langchain/langgraph/prebuilt";
import { tools } from "../tools/tools.js";
import { z } from "zod";

// Initialize Ollama model
const model = new ChatOllama({
  model: "llama3.1",
  temperature: 0,
});

const toolExecutor = new ToolExecutor({ tools });

// --- Functions for the graph ---

async function callModel(state) {
  console.log("=== CALLING MODEL ===");
  console.log("Current messages count:", state.messages?.length || 0);
  
  // Use all messages in the conversation history
  const messages = state.messages || [];
  
  console.log("Invoking model with messages...");
  const response = await model.invoke(messages, { tools });
  
  console.log("Model response - has tool calls:", !!response.tool_calls?.length);
  if (response.tool_calls?.length) {
    console.log("Tool calls:", response.tool_calls.map(tc => `${tc.name}(${JSON.stringify(tc.args)})`));
  }
  
  return { 
    messages: [...messages, response],
    agentResponse: response
  };
}

// Node 2: If LLM requested a tool, run it
async function runTool(state) {
  console.log("=== RUNNING TOOL ===");
  const lastResponse = state.agentResponse;
  
  if (lastResponse?.tool_calls?.length) {
    const toolCall = lastResponse.tool_calls[0]; // Handle one tool call at a time
    console.log(`Executing tool: ${toolCall.name} with args:`, toolCall.args);
    
    try {
      const result = await toolExecutor.invoke({
        tool: toolCall.name,
        toolInput: toolCall.args,
      });
      
      console.log("Tool result:", result);
      
      // Create a proper ToolMessage to add to the conversation
      const toolMessage = new ToolMessage({
        content: typeof result === 'string' ? result : JSON.stringify(result),
        tool_call_id: toolCall.id,
      });
      
      return { 
        messages: [...state.messages, toolMessage],
        toolResult: result 
      };
    } catch (error) {
      console.error("Tool execution error:", error);
      const errorMessage = new ToolMessage({
        content: `Error: ${error.message}`,
        tool_call_id: toolCall.id,
      });
      
      return { 
        messages: [...state.messages, errorMessage],
        toolResult: { error: error.message }
      };
    }
  }
  
  console.log("No tool calls to execute");
  return { toolResult: null };
}

// Decision function - this is critical for preventing infinite loops
function shouldContinue(state) {
  console.log("=== DECISION POINT ===");
  const lastResponse = state.agentResponse;
  
  // If the agent made tool calls, execute them
  if (lastResponse?.tool_calls?.length > 0) {
    console.log("Decision: Going to tool execution");
    return "tool";
  }
  
  // Otherwise, we're done
  console.log("Decision: Ending workflow");
  return "end";
}

// Define the workflow state schema
const workflowStateSchema = z.object({
  messages: z.array(z.any()).default([]),
  agentResponse: z.any().optional(),
  toolResult: z.any().optional(),
});

// --- Build Graph ---
export const workflow = new StateGraph(workflowStateSchema)
  .addNode("model", callModel)
  .addNode("tool", runTool)
  .setEntryPoint("model")
  .addConditionalEdges("model", shouldContinue, {
    tool: "tool",
    end: END,
  })
  .addEdge("tool", "model"); // After tool use, go back to model

// Usage example:
export async function runWorkflow(userInput, config = {}) {
  const app = workflow.compile();
  
  const initialState = {
    messages: [new HumanMessage(userInput)],
    agentResponse: null,
    toolResult: null,
  };

  // Set recursion limit and other config options
  const runConfig = {
    recursionLimit: 10, // Reasonable limit for tool chaining
    ...config
  };

  try {
    const result = await app.invoke(initialState, runConfig);
    return result;
  } catch (error) {
    console.error("Workflow execution error:", error);
    throw error;
  }
}