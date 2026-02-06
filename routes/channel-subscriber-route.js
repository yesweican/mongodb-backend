import express from 'express';
import { getChannelSubscribers } from '../api/channel-controller.js';
import authenticateToken from "../middleware/auth_middleware.js";

const router = express.Router();

// Route to get all subscribers of a channel
router.get("/:id", authenticateToken, getChannelSubscribers);

export default router;