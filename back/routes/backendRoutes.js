import express from 'express';
import { Router } from 'express';
import { getEmbedding } from '../controllers/backendController.js';
import { Agentcall } from '../controllers/agentController.js';

const router = Router();

// Add middleware function to parse the request body as JSON
router.use(express.json());

// Add GET route for embedding
router.get('/embedding', getEmbedding);

router.post('/agent', Agentcall);

export default router;