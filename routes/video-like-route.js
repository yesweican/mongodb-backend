// routes/video-like-Routes.js
import express from 'express';
import { videoLikeToggle, videoLikeCheck, videoLikeCount } from '../api/videolike-controller.js';
import authenticateToken from "../middleware/auth_middleware.js";

const router = express.Router();

// Route to toggle a new Video Like
router.post('/:videoId', authenticateToken, videoLikeToggle);

// Check if a user has liked a video
router.get('/check/:videoId', authenticateToken, videoLikeCheck);

// Get the like count for a video
router.get('/count/:videoId', authenticateToken, videoLikeCount);

export default router;