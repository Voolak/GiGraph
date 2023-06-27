import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import {
  JSONLoader,
  JSONLinesLoader,
} from "langchain/document_loaders/fs/json";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { CSVLoader } from "langchain/document_loaders/fs/csv";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { DocxLoader } from "langchain/document_loaders/fs/docx";

export async function getEmbedding(req, res) {
  if (req.session.userId != "undefined" && req.session.userId != ""  && req.session.userId != null){
    try {
        await embedFiles();
        //Render OK
        res.status(200).send("Done");

    } catch (error) {
      console.error(error);
      res.status(500).send("Error processing request");
    }
  }else{
    res.status(500).send("Error processing request");
  }
}

  async function embedFiles(directory){
  
    const loader = new DirectoryLoader(
      directory,
      {
        ".txt": (path) => new TextLoader(path),
        ".pdf": (path) => new PDFLoader(path),
        ".docx": (path) => new DocxLoader(path),
      }
    );

    // Initialize the Text Splitter with a maximum chunk size of 1000 characters and an overlap of 100 characters
    const splitter = new RecursiveCharacterTextSplitter({ maxChunkSize: 2000, overlapSize: 100 });

    // Load and split the PDF document
    const docs = await loader.loadAndSplit(splitter);

    docs.forEach(doc => {
        doc.pageContent = doc.pageContent.replace(/(\n\s*)+/g, '\n');
        doc.pageContent = doc.pageContent.trim().replaceAll('\n', '  ');
    });

    // Create vector store and index the docs
    const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());

    // Save the vector store to a directory
    const directory = 'data/VectorStores/rules/';
    await vectorStore.save(directory);
  }