// routes/following-Routes.js
import express from 'express';
import { createFollowing, getFollowings, deleteFollowing } from '../api/following-controller.js';
import authenticateToken from "../middleware/auth_middleware.js";

const router = express.Router();

// Route to create a new Following
router.post('/', authenticateToken, createFollowing);

// Get all followings or a specific following by ID
router.get("/:id?", authenticateToken, getFollowings);

// Delete an following by ID
router.delete("/:id", authenticateToken, deleteFollowing);

export default router;