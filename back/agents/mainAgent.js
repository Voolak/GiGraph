import { z } from "zod";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { DynamicStructuredTool } from "langchain/tools";
import { setUserId } from "../controllers/globals.js";
import { DocumentAnsweringChain } from "../chains/Main/DocumentAnsweringChain.js";
import { runGraphAgent } from "../agents/graphAgent.js"
import { PrismaClient } from '@prisma/client';
import { SerpAPI } from "langchain/tools";
import { Calculator } from "langchain/tools/calculator";

export const run = async (question, userId) => {
  setUserId(userId);
  const model = new ChatOpenAI({ temperature: 0 });
  const tools = [
    // new Calculator(),
    // new SerpAPI(process.env.SERPAPI_API_KEY, {
    //   location: "Austin,Texas,United States",
    //   hl: "en",
    //   gl: "us",
    // }),
    new DynamicStructuredTool({
      name: "document-answerer",
      description: "Always call this tool first : This tool answers a question based on internal documents.",
      schema: z.object({
        text: z.string().describe("la question en Français")
      }),
      func: async ({ text }) =>{
        try {
          console.log("DOCUMENT CALLED:");
          const arg = { text };
          // Perform your custom tool logic here with the input text
          var chain = await new DocumentAnsweringChain().call(arg);
          console.log("DOCUMENT CALLED DONE");
          const prisma = new PrismaClient();
          try {
            const result = await prisma.answer.create({
              data: {
                output: chain.res,
                exchangeId: 1,
              },
            });

            console.log('New answer created !!');
          } catch (error) {
            console.error('Error creating answer:', error);
          }

          // and return the output text
          return `Réponse: ${chain.res}`;
        } catch (error) {
          // Handle any errors that occur during the processing
          return `Error occurred: ${error.message}`;
        }
      }
    }),
    new DynamicStructuredTool({
      name: "graph-generator-from-context",
      description: "You must call the document-answerer tool beforehand to use this tool. This tool generates graphs based on context given by the tool `document-answerer`. It can not be called before ",
      schema: z.object({
        text: z.string().describe("the users question"),
        type: z.string().describe("graph type"),
        data: z.string().describe("informations from the tool `document-answerer`"),
      }),
      func: async ({ text, type, data }) =>{
        try {
          if(data == ""){
            return "You must call the document-answerer tool beforehand to use this tool."
          }
          const arg = { text, type, data };
          console.log("GRAPH CALLED:");
          // Perform your custom tool logic here with the input text
          var chain = await runGraphAgent(JSON.stringify(arg));
          console.log("GRAPH CALLED DONE");
          // and return the output text
          return `Réponse: Graph generation complete, the user can see his graph in his account, congratulations.`;
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
  console.log("Loaded agent.");

  const input = "Question :' "+question+" . '. If the user wants a graph, first fetch the informations to display in the document-answerer tool and then only, call the graph-generator tool.";

  console.log(`Executing with input "${input}"...`);

  const res = await executor.call({ input });

  console.log({ res });

  var response = await latestGraphOrAnswer(1);

  console.log(response);
  
  return { response }
};


const latestGraphOrAnswer = async (exchangeId) => {
  const prisma = new PrismaClient();
  const graph = await prisma.graph.findFirst({
    where: { exchangeId },
    orderBy: { created_at: 'desc' },
  });

  const answer = await prisma.answer.findFirst({
    where: { exchangeId },
    orderBy: { created_at: 'desc' },
  });

  if (graph && answer) {
    const graphCreatedAt = new Date(graph.created_at);
    const answerCreatedAt = new Date(answer.created_at);

    if (graphCreatedAt > answerCreatedAt) {
      return JSON.parse(graph.data);
    } else {
      return answer.output;
    }
  } else if (graph) {
    return JSON.parse(graph.data);
  } else if (answer) {
    return answer.output;
  } else {
    return null; // Return null if both graph and answer are not found
  }
};