import express from "express";
import { /* getMe,*/ login, logout, register, refreshtoken, deleteuser } from "../api/auth-controller.js";
//import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

//router.get("/me", protectRoute, getMe);
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refreshtoken", refreshtoken);
router.post("/deleteuser", deleteuser);

export default router;
