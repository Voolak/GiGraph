import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { DocxLoader } from "langchain/document_loaders/fs/docx";
import { PrismaClient, ProcessStatus } from '@prisma/client';
import fs from 'fs';
import { PDFDocument } from 'pdf-lib'; 

export async function getEmbedding(req, res) {
  const user = (req.query.userId ?? '1');
  if (user != "undefined" && user != ""  && user != null) {
    let exchangeDocuments;
    let documents;
    const prisma = new PrismaClient();
    try {
      exchangeDocuments = await prisma.exchangeDocument.findMany({
        where: {
          exchangeId: 1,
        }
      });
      documents = await prisma.document.findMany({
        where: {
          id: {
            in: exchangeDocuments.map((exchangeDocument) => exchangeDocument.documentId),
          },
        },
      });
      
      const copyPromises = documents.map((document) => {
        return copyFile(document.directory, 'documents/RobertGirafe/exchangeDocs/' + document.name + '.pdf');
      });
    
      await Promise.all(copyPromises);

      //saveFiles('documents/RobertGirafe/docs', docs);
    } catch (error) {
      console.error(error);
      return res.status(500).json({error: "Couldn't get the documents"});
    }

    try {
      const directoryfor = await embedFiles();
      //Render OK
      exchangeDocuments.forEach(async (exchangeDocument) => {
        const data = await prisma.exchangeDocument.update({
          where: {
            id: exchangeDocument.id,
          },
          data: {
            processed: ProcessStatus.PROCESSED,
          }
        });
      });
      documents.map((document) => {fs.unlinkSync('documents/RobertGirafe/exchangeDocs/' + document.name + '.pdf')});
      return res.json("Traitement des documents terminé");
    } catch (error) {
      console.error(error);
      return res.status(500).json({error: "Error processing request"});
    }
  } else {
      return res.status(500).send("Error processing request");
  }
}

   async function embedFiles(){
    const loader = new DirectoryLoader(
      "documents/RobertGirafe/exchangeDocs/",
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
    const directoryfor = 'documents/RobertGirafe/vectors/iut';
    await vectorStore.save(directoryfor);
  }

  async function copyFile(sourceFilePath, destinationFilePath) {
    try {
      // Charger le fichier source PDF
      const sourcePDFBytes = await fs.promises.readFile(sourceFilePath);
      const sourcePDF = await PDFDocument.load(sourcePDFBytes);
  
      // Créer un nouveau document PDF vide
      const destinationPDF = await PDFDocument.create();
  
      // Copier chaque page du fichier source vers le fichier de destination
      const pagesCount = sourcePDF.getPageCount();
      for (let pageIndex = 0; pageIndex < pagesCount; pageIndex++) {
        const [copiedPage] = await destinationPDF.copyPages(sourcePDF, [pageIndex]);
        destinationPDF.addPage(copiedPage);
      }
  
      // Enregistrer le fichier de destination
      const destinationPDFBytes = await destinationPDF.save();
      await fs.promises.writeFile(destinationFilePath, destinationPDFBytes);
  
      console.log('Fichier PDF copié avec succès.');
    } catch (error) {
      console.error('Erreur lors de la copie du fichier PDF :', error);
    }
  }

  function saveFiles(directoryPath = 'documents/RobertGirafe/docs', files){
    // Create a directory to save the files
    // the directory path where you want to save the files
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath);
    }

    // Save each file in the directory
    files.forEach((file) => {
      const filePath = `${directoryPath}/${file.originalname}`;

      // Use the fs.writeFile function to save the file
      fs.writeFile(filePath, file.buffer, (err) => {
        if (err) {
          console.error(`Error saving file: ${file.originalname}`);
          console.error(err);
        } else {
          console.log(`File saved: ${file.originalname}`);
        }
      });
    });
  }