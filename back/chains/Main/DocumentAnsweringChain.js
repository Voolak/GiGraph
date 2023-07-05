import { OpenAI } from "langchain/llms/openai";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { BaseChain } from "langchain/chains";
import { getUserId } from "../../controllers/globals.js";

export class DocumentAnsweringChain extends BaseChain {
  _chainType() {
    throw new Error("Method not implemented.");
  }
  serialize() {
    throw new Error("Method not implemented.");
  }
  inputKeys = ["data"];
  outputKeys = ["res"];

  async _call(inputs) {

    // const userId = getUserId();

    try{

      const vectorStore = await getVectorStore();

      const model = new OpenAI({
        temperature: 0,
        modelName: "gpt-3.5-turbo-16k-0613",
        verbose: false,
        openAIApiKey: process.env.OPENAI_API_KEY,
      });
      
      console.log(inputs)

      const sanitizedQuestion = inputs.text;

      const retrievedContext = await vectorStore.similaritySearch(
        sanitizedQuestion,
        2
      );
  
      var context = "";
  
      retrievedContext.forEach((document) => {
        context += document["pageContent"];
      });
  
      var QA_PROMPT = `Les informations de contexte sont ci-dessous. 
        ---------------------
        ${context}
        ---------------------
        Compte tenu des informations contextuelles et non des connaissances préalables, répondez à la question suivante du mieux que vous pouvez : ${sanitizedQuestion} ?:
        
        `;
  
      const res = await model.call(QA_PROMPT);
  
      return { res };

    }catch(error){
      console.error(error);
      return error
    }

  }
}

async function getVectorStore() {
  // Load the vector store from the same directory
  const directory = "documents/RobertGirafe/vectors/iut";
  const loadedVectorStore = await HNSWLib.load(
    directory,
    new OpenAIEmbeddings({
      verbose: false,
      openAIApiKey: process.env.OPENAI_API_KEY,
    })
  );
  return loadedVectorStore;
}