import express from 'express';
import { Router } from 'express';
import { getDocuments, getExchange, getDocumentsByExchange } from '../controllers/documentController.js';
const router = Router();

// Add middleware function to parse the request body as JSON
router.use(express.json());

// Add GET route for embedding
router.get('/get', getDocuments);

router.get('/Exchange/get', getExchange);
// Add GET route for embedding
router.get('/get', getDocumentsByExchange);

router.get('/exchanges/:exchangeId/documents', getDocumentsByExchange);

export default router;
