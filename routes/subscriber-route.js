// routes/article-Routes.js
import express from 'express';
import { getSubscribers } from '../api/subscription-controller.js';
import authenticateToken from "../middleware/auth.js";

const router = express.Router();

// Get all my subscriptions or a specific subscription by ID
router.get("/:id?", authenticateToken, getSubscribers);


export default router;