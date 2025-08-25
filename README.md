# Agentic-graph-tool

# Agentic-graph-tool

## How to Start

1. **Install dependencies**  
   Open a terminal in this folder and run:
   ```
   npm install
   ```

2. **Run langchain.js**  
   This script is the starting point. Run it with:
   ```
   node langchain.js
   ```

3. **Run langraph.js**  
   After running `langcahin.js`, you can run:
   ```
   node langraph.js
   ```

## What the Code Does

- **langchain.js**  
  Entry point for the project. Sets up a simple agent using LangChain’s React agent and math tools (addition, subtraction, multiplication, division). Demonstrates invoking the agent with a sample math question.

- **langraph.js**  
  Handles graph-related features. Runs a workflow (imported from `Workflow/ai.js`), sends a user message, and logs the result. Useful for visualizing or processing data from the workflow.

- **tools/tools.js**  
  Contains helper functions and utilities, specifically math tools (add, subtract, multiply, divide) defined as LangChain tools with Zod schemas. These are used by the agent and workflow.

- **Workflow/ai.js**  
  Implements a LangChain StateGraph workflow for tool-augmented conversations. Uses the Ollama LLM and the math tools from `tools/tools.js`. Manages tool execution and conversation state.

- **Langraph_Demo/stateGraph.js**  
  Demonstrates a simple StateGraph workflow with an agent node and a tool node. Shows how to invoke the workflow with sequential messages and maintain context between runs.

- **Langraph_Demo/langraph.js**  
  Demonstrates a React agent with a search tool (Tavily) and a multiply tool. Shows how to persist agent state between runs and invoke the agent with different messages.

- **.env.example**  
  Example environment file showing where to put your Tavily API key.

- **.env**  
  Actual environment file containing your Tavily API key.

- **.gitignore**  
  Specifies files and folders to ignore in git, such as `node_modules` and `.env`.

- **package.json**  
  Project metadata and dependencies for npm.

- **README.md**  
  Project overview, setup instructions, and file descriptions.