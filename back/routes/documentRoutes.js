import express from 'express';
import { Router } from 'express';
import { getDocuments, getExchange, getDocumentsByExchange, deleteDocument } from '../controllers/documentController.js';
import multer from 'multer';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';

const router = Router();
const upload = multer({ dest: 'documents/temp/' }); // Specify the directory where uploaded files will be stored

// Add middleware function to parse the request body as JSON
router.use(express.json());

// Add GET route for embedding
router.get('/get', getDocuments);

router.get('/Exchange/get', getExchange);

// Add GET route for embedding
router.get('/get', getDocumentsByExchange);

router.get('/exchanges/:exchangeId/documents', getDocumentsByExchange);

router.post('/delete', deleteDocument);

router.post('/uploadDocument', upload.single('file'), async (req, res) => {
    try {
      const file = req.file; // Access the uploaded file through req.file

      // Call saveFiles() function with the file
      const document = await saveFiles(file);
  
      res.json({ message: 'Document created successfully', document: document });
    } catch (error) {
      console.error('Error creating document:', error);
      res.status(500).json({ error: 'Failed to create document' });
    }
  });

export default router;

async function saveFiles(file) {
  const sourcePath = file.path; // Temporary path of the uploaded file
  const destinationPath = 'documents/RobertGirafe/docs/' + file.originalname; // Destination path with the original file name

  // Move the uploaded file to the destination folder
  fs.renameSync(sourcePath, destinationPath);

  const prisma = new PrismaClient();
  // Continue with the rest of the route logic...
  const document = await prisma.document.create({
    data: {
      name: file.originalname,
      directory: destinationPath,
      userId: 1, // Replace with the actual user ID
      ExchangeDocument: {
        create: {
          exchange: { connect: { id: 1 } }, // Replace 1 with the actual exchange ID
          processed: 'NOT_PROCESSED',
        },
      },
    },
  });
  
  console.log('Saved file:', destinationPath);
  return document;
}