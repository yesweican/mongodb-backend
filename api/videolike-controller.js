import VideoLike from "../models/videolike-model.js";

/**
 * POST /api/videos/:id/like
 * Toggle like / unlike
 */
export const videoLikeToggle = async (req, res, next) => {
  try {
    const videoId = req.params.videoId;
    const userId = req.user; // or req.user.id

    if (!videoId) {
      return res.status(400).json({ message: "Video ID is required" });
    }

    const existingLike = await VideoLike.findOne({
      video: videoId,
      viewer: userId
    });

    if (existingLike) {
      await VideoLike.deleteOne({ _id: existingLike._id });
      return res.status(200).json({ liked: false });
    }

    await VideoLike.create({
      video: videoId,
      viewer: userId
    });

    res.status(200).json({ liked: true });
  } catch (err) {
    // handles duplicate key race conditions gracefully
    if (err.code === 11000) {
      return res.status(200).json({ liked: true });
    }
    next(err);
  }
};

/**
 * GET /api/videos/:id/like/check
 * Check if current user liked this video
 */
export const videoLikeCheck = async (req, res, next) => {
  try {
    const videoId = req.params.videoId;
    const userId = req.user;

    const like = await VideoLike.findOne({
      video: videoId,
      viewer: userId
    });

    res.status(200).json({ liked: !!like });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/videos/:id/like/count
 * Get total like count for a video
 */
export const videoLikeCount = async (req, res, next) => {
  try {
    const videoId = req.params.videoId;

    const count = await VideoLike.countDocuments({
      video: videoId
    });

    res.status(200).json({ count });
  } catch (err) {
    next(err);
  }
};