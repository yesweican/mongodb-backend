import express from 'express';
import { getChannelVideos } from '../api/channel-controller.js';

const router = express.Router();

// Route to get all videos of a channel
router.get("/:id", getChannelVideos);

export default router;