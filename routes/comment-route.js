import express from "express";
import {
  createComment,
  updateComment,
  deleteComment
} from "../api/comment-controller.js";
import authenticateToken from "../middleware/auth_middleware.js";

const router = express.Router();

/**
 * Create a comment for a video
 */
router.post(
  "/:videoId",
  authenticateToken,
  createComment
);

/**
 * Update a comment (creator only)
 */
router.patch(
  "/:id",
  authenticateToken,
  updateComment
);

/**
 * Delete a comment (owner only)
 */
router.delete(
  "/:id",
  authenticateToken,
  deleteComment
);

export default router;
