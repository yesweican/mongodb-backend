import express from "express";
/*
import { protectRoute } from "../middleware/protectRoute.js";
import { followUnfollowUser, getSuggestedUsers, getUserProfile, updateUser } from "../controllers/user-controller.js";
*/
import { getUser } from "../api/user-controller.js";
const router = express.Router();

/*
router.get("/suggested", protectRoute, getSuggestedUsers);
router.post("/follow/:id", protectRoute, followUnfollowUser);
router.post("/update", protectRoute, updateUser);
*/
router.get("/:username",  getUser);
export default router;