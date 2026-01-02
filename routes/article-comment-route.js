// routes/commentRoutes.js
import express from 'express';
import { createArticleComment } from '../api/article-comment-controller.js';

const router = express.Router();

// Route to create a new article comment
router.post('/', createArticleComment);

export default router;
