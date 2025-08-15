import express from "express";
const router = express.Router();
import {
    sendMessage,
    getMessages,
    uploadFile,
    downloadFile
} from "../controllers/messageControllers.js";
import { Auth } from "../middleware/user.js";
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

// --- THIS IS THE CORRECT ORDER ---

// 1. Specific routes first
router.post("/upload", Auth, upload.single('file'), uploadFile);
router.get("/download", Auth, downloadFile);

// 2. Generic post route
router.post("/", Auth, sendMessage);

// 3. Generic route with a parameter comes last
router.get("/:chatId", Auth, getMessages);


export default router;