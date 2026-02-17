import Comment from "../models/comment-model.js";
import { AppError } from "../errors/app_error.js";

/**
 * Create comment
 */
export const createComment = async (req, res, next) => {
  try {
    const { videoId } = req.params;
    const { details } = req.body;
    const { userId } = req.user;

    if (!details?.trim()) {
      throw new AppError("Comment text is required", 400);
    }

    const comment = await Comment.create({
      video_id: videoId,
      creator: userId,
      details
    });

    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
};

/**
 * Update comment
 */
export const updateComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { details } = req.body;
    const { userId } = req.user;

    if (!details?.trim()) {
      throw new AppError("Comment text is required", 400);
    }

    const comment = await Comment.findById(id);

    if (!comment) {
      throw new AppError("Comment not found", 404);
    }

    if (comment.creator.toString() !== userId) {
      throw new AppError("Forbidden: not comment owner", 403);
    }

    comment.details = details.trim();
    await comment.save();

    res.status(200).json(comment);
  } catch (err) {
    next(err);
  }
};


/**
 * Get comments for a video (paginated)
 */
export const getCommentsByVideo = async (req, res, next) => {
  try {
    const { videoId } = req.params;

    const page = Number(req.query.page ?? 0);
    const pageSize = Number(req.query.pageSize ?? 20);

    const comments = await Comment.find({ video_id: videoId })
      .populate("creator", "username fullname")
      .sort({ createdAt: -1 })
      .skip(page * pageSize)
      .limit(pageSize);

    res.status(200).json({
      videoId,
      count: comments.length,
      results: comments
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete comment (creator and video owner only)
 */
export const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    const comment = await Comment.findById(id);

    if (!comment) {
      throw new AppError("Comment not found", 404);
    }

    const video = await Video.findById(comment.video_id);

    if (!video) {
      throw new AppError("Video not found", 404);
    }

    const isCommentOwner =
      comment.creator.toString() === userId;

    const isVideoOwner =
      video.creator.toString() === userId;

    if (!isCommentOwner && !isVideoOwner) {
      throw new AppError("Forbidden", 403);
    }

    // 🔮 Future-proof: soft delete ready
    // comment.deleted = true;
    // await comment.save();

    await comment.deleteOne();

    res.status(200).json({ message: "Comment removed" });
  } catch (err) {
    next(err);
  }
};
