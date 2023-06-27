import { z } from "zod";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { Calculator } from "langchain/tools/calculator";
import { DynamicStructuredTool } from "langchain/tools";
import { setUserId } from "../controllers/globals.js";
import { DocumentAnsweringChain } from "../chains/Main/DocumentAnsweringChain.js";

export const run = async (question, userId) => {
  setUserId(userId);
  const model = new ChatOpenAI({ temperature: 0 });
  const tools = [
    new DynamicStructuredTool({
      name: "graph-generator",
      description: "This tool generates graphs from a question.",
      schema: z.object({
        text: z.string().describe("the question")
      }),
      func: async ({ string }) =>{
        try {
          // Perform your custom tool logic here with the input text
          var chain = await new DocumentAnsweringChain().call(string);
          // and return the output text
          return `Réponse: ${chain.res}`;
        } catch (error) {
          // Handle any errors that occur during the processing
          return `Error occurred: ${error.message}`;
        }
      }
    }),
  ];

  const executor = await initializeAgentExecutorWithOptions(tools, model, {
    agentType: "structured-chat-zero-shot-react-description",
    verbose: true,
  });
  console.log("Loaded agent.");

  const input = question;

  console.log(`Executing with input "${input}"...`);

  const result = await executor.call({ input });

  console.log({ result });

  /*
    {
      "output": "67.95299776074"
    }
  */
};