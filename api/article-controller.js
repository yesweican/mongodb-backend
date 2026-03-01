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

// Get all Articles by Author or User Id
// With extra policy restriction
export async function getArticles(req, res, next) {
  try {
    const { author } = req.query;

    const page = Number(req.query.page ?? 0);
    const pageSize = Number(req.query.pageSize ?? 20);

    const currentUserId = req.user?.id;

    if (!currentUserId) {
      throw new AppError("Authentication required", 401);
    }

    const targetAuthor = author ?? currentUserId;

    if (!mongoose.Types.ObjectId.isValid(targetAuthor)) {
      throw new AppError("Invalid author ID", 400);
    }

    const isSelfRequest = targetAuthor === currentUserId;
    const filter = { author: targetAuthor };

    let total;
    let rows;

    if (isSelfRequest) {
      // 🔓 Full access
      const offset = page * pageSize;

      [total, rows] = await Promise.all([
        Article.countDocuments(filter),
        Article.find(filter)
          .sort({ createdAt: -1 })
          .skip(offset)
          .limit(pageSize)
          .lean()
      ]);

    } else {
      // 🔒 Public limited window
      const MAX_PUBLIC_WINDOW = 100;

      const offset = page * pageSize;

      // If offset exceeds allowed window → empty result
      if (offset >= MAX_PUBLIC_WINDOW) {
        return res.status(200).json({
          page,
          pageSize,
          total: MAX_PUBLIC_WINDOW,
          count: 0,
          results: []
        });
      }

      // Adjust limit so we never go beyond 100
      const allowedLimit = Math.min(
        pageSize,
        MAX_PUBLIC_WINDOW - offset
      );

      [total, rows] = await Promise.all([
        Article.countDocuments(filter).then(count =>
          Math.min(count, MAX_PUBLIC_WINDOW)
        ),
        Article.find(filter)
          .sort({ createdAt: -1 })
          .skip(offset)
          .limit(allowedLimit)
          .lean()
      ]);
    }

    res.status(200).json({
      page,
      pageSize,
      total,
      count: rows.length,
      results: rows
    });

  } catch (err) {
    next(err);
  }
}

export const getArticleById = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await Article.findById(id).populate("author", "fullname email");
    if (!article) return res.status(404).json({ message: "Article not found" });
    return res.status(200).json(article);
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

export async function searchArticles(req, res, next) {
  try {
    const { q } = req.query;

    if (!q || !q.trim()) {
      throw new AppError("Search query is required", 400);
    }

    const page = Number(req.query.page ?? 0);
    const pageSize = Number(req.query.pageSize ?? 20);
    const skip = page * pageSize;

    const filter = {
      $or: [
        { title: { $regex: q, $options: "i" } },
        { details: { $regex: q, $options: "i" } }
      ]
    };

    const [total, rows] = await Promise.all([
      Article.countDocuments(filter),
      Article.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean()
    ]);

    res.status(200).json({
      page,
      pageSize,
      total,
      count: rows.length,
      results: rows
    });

  } catch (err) {
    next(err);
  }
}
