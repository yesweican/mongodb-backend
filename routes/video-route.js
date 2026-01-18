// routes/article-Routes.js
import express from 'express';
import multer from "multer";
import { createVideo, getMyVideos, getVideoById, updateVideo, deleteVideo } from '../api/video-controller.js';
import authenticateToken from "../middleware/auth_middleware.js";
import { uploadVideo } from "../middleware/video_middleware.js";

const router = express.Router();

// Configure Multer for temporary file storage
const upload = multer({
    dest: "uploads/", // Temporary folder for uploaded files
    limits: { fileSize: 50 * 1024 * 1024 }, // Limit file size to 50 MB
});

// Route to create a new Video
router.post(
  "/",
  authenticateToken,
  uploadVideo.single("file"),
  createVideo
);

// Get all videos or a specific video by ID
router.get("/", authenticateToken, getMyVideos);
router.get("/:id", getVideoById);

// Update an video by ID
router.patch("/:id", authenticateToken, updateVideo);

// Delete an video by ID
router.delete("/:id", authenticateToken, deleteVideo);

export default router;