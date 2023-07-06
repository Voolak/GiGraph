import { OpenAI } from "langchain/llms/openai";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { BaseChain } from "langchain/chains";
import { getUserId } from "../../controllers/globals.js";
import { PrismaClient } from '@prisma/client';

export class LineChartChain extends BaseChain {
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

      const model = new OpenAI({
        temperature: 0,
        modelName: "gpt-3.5-turbo-16k-0613",
        verbose: false,
        openAIApiKey: process.env.OPENAI_API_KEY,
      });
      console.log(inputs)

      const question = inputs.text;
      const type = inputs.type;
      const data = inputs.data;


      var QA_PROMPT = `L'utilisateur veux ceci : ${question}

       Voici un exemple de données Echarts pour un line chart :
       {
        type: 'line', 
        values: [820, 932, 901, 934, 1290, 1330, 1320],
        columnsName: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      } 
       Ecris les données qui vont avec un graph Echarts de type line-chart en mettant en valeur toutes ces informations : ${data}
       Suis le même schéma, value est forcément un int :
       {
        type: 'line', 
        values: [,,,,],
        columnsName: ['', '', '', '', '', '', '']
      } 

      Ne renvoie qu'un json, pas de texte:
        `;

      const result = await model.call(QA_PROMPT);

      try {
        const prisma = new PrismaClient();
        const graphCreate = await prisma.graph.create({
          data: {
            type: 'pie',
            data: result,
            exchangeId: 1,
          },
        });
    
        console.log('New graph created:');
      } catch (error) {
        console.error('Error creating graph:', error);
      }


    
      var res = "Here is the chart : ((chart))" ;
      return { res };

    }catch(error){
      console.error(error);
      return error
    }

  }
}