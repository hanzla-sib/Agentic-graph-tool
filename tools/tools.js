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