import { z } from "zod";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { DynamicStructuredTool } from "langchain/tools";
import { setUserId } from "../controllers/globals.js";
import { PieChartChain } from "../chains/Main/pieChartChain.js"
import { BarChartChain } from "../chains/Main/barChartChain.js"
import { LineChartChain } from "../chains/Main/lineChartChain.js"

export const runGraphAgent = async (question, userId) => {
  setUserId(userId);
  const model = new ChatOpenAI({ temperature: 0 });
  const tools = [
    new DynamicStructuredTool({
      name: "pie-chart",
      description: "This tool generates pie-charts.",
      schema: z.object({
        text: z.string().describe("the users question"),
        type: z.string().describe("graph type"),
        data: z.string().describe("a string of data for the graph"),
      }),
      func: async ({ text, type, data }) =>{
        try {
          const arg = { text, type, data };
          // Perform your custom tool logic here with the input text
          console.log("PIE CHART CALLED:");
          var chain = await new PieChartChain().call(arg);
          console.log("PIE CHART CALLED DONE");
          // and return the output text
          return `Réponse: la chaine a été créée ((chain)).`;
        } catch (error) {
          // Handle any errors that occur during the processing
          return `Error occurred: ${error.message}`;
        }
      }
    }),new DynamicStructuredTool({
      name: "bar-chart",
      description: "This tool generates bar-charts.",
      schema: z.object({
        text: z.string().describe("the users question"),
        type: z.string().describe("graph type"),
        data: z.string().describe("a string of data for the graph"),
      }),
      func: async ({ text, type, data }) =>{
        try {
          const arg = { text, type, data };
          console.log("BAR CHART CALLED:");
          // Perform your custom tool logic here with the input text
          var chain = await new BarChartChain().call(arg);
          console.log("BAR CHART CALLED DONE");
          // and return the output text
          return `Réponse: la chaine a été créée ((chain)).`;
        } catch (error) {
          // Handle any errors that occur during the processing
          return `Error occurred: ${error.message}`;
        }
      }
    }),new DynamicStructuredTool({
      name: "line-chart",
      description: "This tool generates line-charts.",
      schema: z.object({
        text: z.string().describe("the users question"),
        type: z.string().describe("graph type"),
        data: z.string().describe("a string of data for the graph"),
      }),
      func: async ({ text, type, data }) =>{
        try {
          const arg = { text, type, data };
          console.log("LINE CHART CALLED:");
          // Perform your custom tool logic here with the input text
          var chain = await new LineChartChain().call(arg);
          console.log("LINE CHART CALLED:");
          // and return the output text
          return `Réponse: la chaine a été créée ((chain)).`;
        } catch (error) {
          // Handle any errors that occur during the processing
          return `Error occurred: ${error.message}`;
        }
      }
    })
  ];

  const executor = await initializeAgentExecutorWithOptions(tools, model, {
    agentType: "structured-chat-zero-shot-react-description",
    verbose: true,
  });

  const input = question;

  console.log(`Executing GRAPH AGENT with input "${input}"...`);

  const res = await executor.call({ input });

  var  result = "Here is the chart : ((chart))";

  return { result };

};