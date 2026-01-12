// routes/video-search-route.js
import express from 'express';
import { searchVideos } from '../api/video-controller.js';

const router = express.Router();

router.get("/", searchVideos);

export default router;