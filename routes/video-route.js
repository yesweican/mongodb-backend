// routes/article-Routes.js
import express from 'express';
import multer from "multer";
import { createVideo, getVideos, updateVideo, deleteVideo } from '../api/video-controller.js';
import authenticateToken from "../middleware/auth.js";

const router = express.Router();

// Configure Multer for temporary file storage
const upload = multer({
    dest: "uploads/", // Temporary folder for uploaded files
    limits: { fileSize: 50 * 1024 * 1024 }, // Limit file size to 50 MB
});

// Route to create a new Video
router.post('/', authenticateToken, upload.single("file"), createVideo);

// Get all videos or a specific video by ID
router.get("/:id?", authenticateToken, getVideos);

// Update an video by ID
router.patch("/:id", authenticateToken, updateVideo);

// Delete an video by ID
router.delete("/:id", authenticateToken, deleteVideo);

export default router;