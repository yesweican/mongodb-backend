import express from "express";
import {
  getCommentsByVideo,
} from "../api/comment-controller.js";
//import authenticateToken from "../middleware/auth_middleware.js";

const router = express.Router();

/**
 * Get comments for a video (public)
 */
router.get(
  "/:videoId",
  getCommentsByVideo
);

export default router;