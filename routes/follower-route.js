// routes/follower-Routes.js
import express from 'express';
import { getFollowers } from '../api/following-controller.js';
import authenticateToken from "../middleware/auth_middleware.js";

const router = express.Router();

// Get all followers or a specific follower by ID
router.get("/:id?", authenticateToken, getFollowers);

export default router;