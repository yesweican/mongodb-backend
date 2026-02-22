// routes/subscription-video-Routes.js
import express from 'express';
import { getSubscriptionVideos } from '../api/video-controller.js';
import authenticateToken from "../middleware/auth_middleware.js";

const router = express.Router();

// Get all subscription videos
router.get("/", authenticateToken, getSubscriptionVideos);

export default router;