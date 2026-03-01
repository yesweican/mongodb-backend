// routes/article-search-route.js
import express from 'express';
import { searchArticles } from '../api/article-controller.js';

const router = express.Router();

router.get("/", searchArticles);

export default router;