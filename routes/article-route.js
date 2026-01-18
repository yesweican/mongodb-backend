// routes/article-Routes.js
import express from 'express';
import { createArticle, getArticles, updateArticle, deleteArticle } from '../api/article-controller.js';
import authenticateToken from "../middleware/auth_middleware.js";
import { uploadImage } from "../middleware/image_middleware.js";

const router = express.Router();

// Route to create a new Article
router.post(
  "/",
  authenticateToken,
  uploadImage.single("file"),
  articleController.createArticle
);

// Get all articles or a specific article by ID
router.get("/:id?", getArticles);

// Update an article by ID
router.patch("/:id", authenticateToken, updateArticle);

// Delete an article by ID
router.delete("/:id", authenticateToken, deleteArticle);

export default router;
