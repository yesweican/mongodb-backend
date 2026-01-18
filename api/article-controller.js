// controllers/postController.js
import Article from '../models/article-model.js';
import { AppError } from "../errors/app_error.js";

const buildImageUrl = (req, filename) => {
  // This is the SINGLE place image_url is constructed
  return `${req.protocol}://${req.get("host")}/uploads/images/${filename}`;
};

// Create a new article
export const createArticle = async (req, res) => {
  const { title, details } = req.body;
  console.log('Current User:', req.user);
  try {
    var imagePath;
    if (req.file) {
      //imagePath = `/uploads/images/${req.file.filename}`;
      imagePath = buildImageUrl(req, req.file.filename);
    }

    console.log('User Id:', req.user.userId);
    const newArticle = new Article({ title, details, author: req.user.userId, imageURL: imagePath });
    const savedArticle = await newArticle.save();

    res.status(201).json({ message: 'Article created successfully', article: savedArticle });
  } catch (error) {
    //console.error('Error creating article:', error);
    res.status(500).json({ message: 'Failed to create article, author=>'+user, error: error.message });
  }
};

// Get all Articles or get Article by Id
export const getArticles = async (req, res) => {
  try {
    const { id } = req.params;
    if (id) {
      const article = await Article.findById(id).populate("author", "fullname email");
      if (!article) return res.status(404).json({ message: "Article not found" });
      return res.status(200).json(article);
    }

    const articles = await Article.find().populate("author", "fullname email");
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch articles", error: error.message });
  }
};

// Get all Articles or get Article by Id
export const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedArticle = await Article.findByIdAndUpdate(id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Validate the new data against the schema
    });

    if (!updatedArticle) return res.status(404).json({ message: "Article not found" });

    res.status(200).json({ message: "Article updated successfully", article: updatedArticle });
  } catch (error) {
    res.status(400).json({ message: "Failed to update article", error: error.message });
  }
};

// Get all Articles or get Article by Id
export const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedArticle = await Article.findByIdAndDelete(id);

    if (!deletedArticle) return res.status(404).json({ message: "Article not found" });

    res.status(200).json({ message: "Article deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete article", error: error.message });
  }
};
