// routes/article-Routes.js
import express from 'express';
import { createArticle, getMyArticles, updateArticle, deleteArticle, getArticleById } from '../api/article-controller.js';
import authenticateToken from "../middleware/auth_middleware.js";
import { uploadImage } from "../middleware/image_middleware.js";

const router = express.Router();

// Route to create a new Article
router.post(
  "/",
  authenticateToken,
  uploadImage.single("file"),
  createArticle
);

// Get all articles or a specific article by ID
router.get("/", getMyArticles);

router.get("/:id", getArticleById);

// Update an article by ID
router.patch("/:id", authenticateToken, updateArticle);

// Delete an article by ID
router.delete("/:id", authenticateToken, deleteArticle);

export default router;
