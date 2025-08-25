// index.js
import { MemorySaver } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";
import { workflow } from "./Workflow/ai.js";

const checkpointer = new MemorySaver();
const compiled = workflow.compile({ checkpointer });

async function main() {
  const userInput = "Please add 12 and 8 and then multiply by 2";
console.log("=== User Input ===");
  const result = await compiled.invoke(
    { messages: [new HumanMessage(userInput)] },
    { configurable: { thread_id: "math-session" } }
  );

  console.log("=== Final Result ===");
  console.log(result);
}

main();
