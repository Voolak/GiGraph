import express from 'express';
import { Router } from 'express';
import { Agentcall } from '../controllers/agentController.js';
import { getEmbedding } from '../controllers/backendController.js';
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { DocxLoader } from "langchain/document_loaders/fs/docx";

const router = Router();

// Add middleware function to parse the request body as JSON
router.use(express.json());

// Add GET route for embedding
router.get('/embedding', getEmbedding);

router.post('/agent', Agentcall);

export default router;
