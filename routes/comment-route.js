import express from "express";
import {
  createComment,
  getCommentsByVideo,
  updateComment,
  deleteComment
} from "../api/comment-controller.js";
import authenticateToken from "../middleware/auth_middleware.js";

const router = express.Router();

/**
 * Create a comment for a video
 */
router.post(
  "/videos/:videoId/comments",
  authenticateToken,
  createComment
);

/**
 * Update a comment (creator only)
 */
router.patch(
  "/comments/:id",
  authenticateToken,
  updateComment
);

/**
 * Get comments for a video (public)
 */
router.get(
  "/videos/:videoId/comments",
  getCommentsByVideo
);


/**
 * Delete a comment (owner only)
 */
router.delete(
  "/comments/:id",
  authenticateToken,
  deleteComment
);

export default router;
