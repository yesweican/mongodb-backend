// controllers/videoController.js
// import path from "path";
// import fs from "fs";
import Video from '../models/video-model.js';
import Channel from '../models/channel-model.js';
import Subscription from "../models/subscription-model.js";
import { AppError } from '../errors/app_error.js'
import getPaginationParams from '../utilities/pagination.js';

const buildVideoUrl = (req, filename) => {
  // This is the SINGLE place video_url is constructed
  return `${req.protocol}://${req.get("host")}/uploads/videos/${filename}`;
};

// Create a new video
export const createVideo = async (req, res) => {

  const file = req.file; // Multer processes 'file' field
  const { title, description, channelId} = req.body;
  const { userId } = req.user;

  //console.log('last user:'+ req.user.userId);  // userId from middleware
  try {
    // Validate input
    if (!file) {
      return res.status(400).json({ message: "No file uploaded!" });
    }
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required!" });
    }

        /* -------- Channel Ownership Check -------- */
    if(channelId) {
      const channel = await Channel.findById(channelId);

      if (!channel) {
        return res.status(404).json({
          message: "Channel not found"
        });
      }

      if (channel.owner.toString() !== userId) {
        return res.status(403).json({
          message: "You are not authorized to upload videos to this channel"
        });
      }
    }

    // Optionally: Save the file to cloud storage (e.g., AWS S3, Azure Blob, GCP)
    // For now, we'll just rename the file to its original name for demonstration.
    // const targetPath = path.join(__dirname, "uploads", file.originalname);
    // fs.renameSync(file.path, targetPath); // Move and rename the file

    //const videoPath = `/uploads/videos/${req.file.filename}`;
    const videoPath = buildVideoUrl(req, req.file.filename);

    const newVideo = new Video({
      title,
      videoURL: videoPath,
      description,
      channelId,
      creator: req.user.userId,
    });

    const savedVideo = await newVideo.save();

    res.status(201).json({ 
      message: 'Video created successfully', 
      file: {
        filename: file.originalname,
        path: file.path,
        size: file.size,
      },
      video: savedVideo });
  } catch (error) {
    console.error('Error creating video:', error);
    res.status(500).json({ message: 'Failed to create Video, creator=>'+req.user.userId, error: error.message });
  }
};

export const getMyVideos = async (req, res) => {
  try {
    const { userId } = req.user;

    if (!userId) {
      throw new AppError("User ID is required", 400);
    }

    const { page, pageSize, skip } = getPaginationParams(req);

    const [results, total] = await Promise.all([
      Video.find({ creator: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      Video.countDocuments({ creator: userId })
    ]);

    res.status(200).json({
      page,
      pageSize,
      total,
      count: results.length,
      results
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch My Videos",
      error: error.message
    });
  }
};

export const getVideoById = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id).populate('channelId');
    if (!video) return res.status(404).json({ message: "Video not found" });
      return res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch Video By Id", error: error.message });
  }
};

// Search videos (weighted text search)
export const searchVideos = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({ message: "Search term is required" });
    }

    const { page, pageSize, skip } = getPaginationParams(req);

    const [results, total] = await Promise.all([
      Video.find(
        { $text: { $search: q } },
        { score: { $meta: "textScore" } }
      )
        .sort({ score: { $meta: "textScore" } })
        .skip(skip)
        .limit(pageSize)
        .populate("creator", "username fullname")
        .lean(),
      Video.countDocuments({ $text: { $search: q } })
    ]);

    res.status(200).json({
      query: q,
      page,
      pageSize,
      total,
      count: results.length,
      results
    });

  } catch (error) {
    res.status(500).json({
      message: "Video search failed",
      error: error.message
    });
  }
};

// Get all subscription videos
export const getSubscriptionVideos = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { page, pageSize, skip } = getPaginationParams(req);

    // 1️⃣ Find subscribed channels
    const subscriptions = await Subscription.find(
      { subscriber: userId },
      { channel: 1, _id: 0 }
    ).lean();

    const channelIds = subscriptions.map(sub => sub.channel);

    if (channelIds.length === 0) {
      return res.status(200).json({
        page,
        pageSize,
        total: 0,
        count: 0,
        results: []
      });
    }

    // 2️⃣ Paginate videos
    const filter = { channelId: { $in: channelIds } };

    const [videos, total] = await Promise.all([
      Video.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .populate("channelId", "name")
        .lean(),
      Video.countDocuments(filter)
    ]);

    res.status(200).json({
      page,
      pageSize,
      total,
      count: videos.length,
      results: videos
    });

  } catch (error) {
    console.error("Subscription feed error:", error);
    res.status(500).json({
      message: "Failed to load subscription videos",
      error: error.message
    });
  }
};


// Get all Articles or get Article by Id
export const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedVideo = await Video.findByIdAndUpdate(id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Validate the new data against the schema
    });

    if (!updatedVideo) return res.status(404).json({ message: "Video not found" });

    res.status(200).json({ message: "Video updated successfully", video: updatedVideo });
  } catch (error) {
    res.status(400).json({ message: "Failed to update video", error: error.message });
  }
};

// Get all Articles or get Article by Id
export const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    ////To-Do: check Video ownership first
    const deletedVideo = await Video.findByIdAndDelete(id);

    if (!deletedVideo) return res.status(404).json({ message: "Video not found" });

    res.status(200).json({ message: "Video deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete video", error: error.message });
  }
};

