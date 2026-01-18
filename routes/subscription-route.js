// routes/article-Routes.js
import express from 'express';
import { subscribe, getMySubscriptions, unsubscribe } from '../api/subscription-controller.js';
import authenticateToken from "../middleware/auth_middleware.js";

const router = express.Router();

// Route to create a new Subscription
router.post('/:id', authenticateToken, subscribe);

// Get all my subscriptions or a specific subscription by ID
router.get("/:id?", authenticateToken, getMySubscriptions);

// Delete an subscription by ID
router.delete("/:id", authenticateToken, unsubscribe);

export default router;