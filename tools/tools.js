import {tool} from "@langchain/core/tools" 
import z from "zod"


//Addition tool

export const addTool=tool(
    async({a,b})=> `Result : ${a + b}`,
    {
        name:"addition",
        description:"useful for when you need to add two numbers",
        schema:z.object({
            a:z.number(),
            b:z.number()
        })
    }
)

// Subtraction
export const subtractTool = tool(
  async ({ a, b }) => `Result: ${a - b}`,
  {
    name: "subtraction",
    description: "Subtracts b from a",
    schema: z.object({
      a: z.number(),
      b: z.number(),
    }),
  }
);


// Multiplication
export const multiplyTool = tool(
  async ({ a, b }) => `Result: ${a * b}`,
  {
    name: "multiplication",
    description: "Multiplies two numbers",
    schema: z.object({
      a: z.number(),
      b: z.number(),
    }),
  }
);


// Division
export const divideTool = tool(
  async ({ a, b }) => {
    if (b === 0) return "Error: Cannot divide by zero!";
    return `Result: ${a / b}`;
  },
  {
    name: "division",
    description: "Divides a by b",
    schema: z.object({
      a: z.number(),
      b: z.number(),
    }),
  }
);