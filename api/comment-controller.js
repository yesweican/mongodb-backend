import Comment from "../models/comment-model.js";
import { AppError } from "../errors/app_error.js";
import getPaginationParams from "../utilities/pagination.js";

/**
 * Create comment
 */
export const createComment = async (req, res, next) => {
  try {
    const { video_id } = req.body;
    const { details } = req.body;
    const { userId } = req.user;

    if (!details?.trim()) {
      throw new AppError("Comment text is required", 400);
    }

    const comment = await Comment.create({
      video_id: video_id,
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

    if (!videoId) {
      return res.status(400).json({ message: "Video ID is required" });
    }

    const { page, pageSize, skip } = getPaginationParams(req);

    const filter = { video_id: videoId };

    const [comments, total] = await Promise.all([
      Comment.find(filter)
        .populate("creator", "username fullname")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      Comment.countDocuments(filter)
    ]);

    res.status(200).json({
      videoId,
      page,
      pageSize,
      total,
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
