// controllers/commentController.js
import ArticleComment from '../models/article-comment-model.js';

// Create a new comment
export const createArticleComment = async (req, res) => {
  try {
    const { article_id, author, description } = req.body;

    const newArticleComment = new ArticleComment({ article_id, author, description });
    const savedComment = await newArticleComment.save();

    res.status(201).json({ message: 'Comment created successfully', comment: savedComment });
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ message: 'Failed to create comment', error: error.message });
  }
};
