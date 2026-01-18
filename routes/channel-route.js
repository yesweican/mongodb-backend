// routes/article-Routes.js
import express from 'express';
import { createChannel, getMyChannels, getChannelById, updateChannel, deleteChannel } from '../api/channel-controller.js';
import authenticateToken from "../middleware/auth_middleware.js";

const router = express.Router();

// Route to create a new Channel
router.post('/', authenticateToken, createChannel);

// Get all channels or a specific channel by ID
router.get("/", authenticateToken, getMyChannels);
router.get("/:id", getChannelById);

// Update an channel by ID
router.patch("/:id", authenticateToken, updateChannel);

// Delete an channel by ID
router.delete("/:id", authenticateToken, deleteChannel);

export default router;