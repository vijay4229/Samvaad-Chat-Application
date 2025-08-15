// server/routes/aiRoutes.js
import express from 'express';
// Add generateIntroLine to the import
import { chatWithAI, generateIntroLine } from '../controllers/aiController.js';
import { Auth } from '../middleware/user.js';

const router = express.Router();

router.post('/chat', Auth, chatWithAI);
router.post('/generate-intro', Auth, generateIntroLine); // <-- ADD THIS NEW ROUTE

export default router;