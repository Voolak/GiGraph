import { Tool } from "langchain/tools";
import { DocumentAnsweringChain } from "../../chains/Main/DocumentAnsweringChain.js";

export class DocumentAnsweringTool extends Tool {
    name = "graph-generator";
  
    description = "This tool generates graphs from a question.";
  
    async _call(arg){
      try {
        // Perform your custom tool logic here with the input text
        var chain = await new DocumentAnsweringChain().call(arg);
        // and return the output text
        return `Réponse: ${chain.res}`;
      } catch (error) {
        // Handle any errors that occur during the processing
        return `Error occurred: ${error.message}`;
      }
    }
  }