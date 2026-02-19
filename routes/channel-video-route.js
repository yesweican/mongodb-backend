import express from 'express';
import { getChannelVideos } from '../api/channel-controller.js';
import authenticateToken from "../middleware/auth_middleware.js";

const router = express.Router();

// Route to get all videos of a channel
router.get("/:id", authenticateToken, getChannelVideos);

export default router;