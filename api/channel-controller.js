// controllers/postController.js
import Channel from '../models/channel-model.js';
import Subscription from '../models/subscription-model.js';
import Video from '../models/video-model.js';
import { AppError } from '../errors/app_error.js';
import getPaginationParams from '../utilities/pagination.js';

// Create a new channel
export const createChannel = async (req, res) => {
  const { name, description } = req.body;
  //console.log('last user:'+ req.user);  // the user<=userId from middleware
  try {
    console.log('User Id:', req.user);
    const newChannel = new Channel({ name, description, owner: req.user.userId });
    const savedChannel = await newChannel.save();

    res.status(201).json({ message: 'Channel created successfully', channel: savedChannel });
  } catch (error) {
    //console.error('Error creating channel:', error);
    res.status(500).json({ message: 'Failed to create Channel, author=>'+user, error: error.message });
  }
};

// Get all My Channels
export const getMyChannels = async (req, res) => {
  try{
    const { userId }  = req.user;

    if (!userId) {
      throw new AppError("User ID is required", 400);
    }    

    const results = await Channel.find({ owner: userId }).populate("owner", "fullname email");

    res.status(200).json({
      count: results.length,
      results
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch My Channels", error: error.message });
  }
};

export const getChannelById = async (req, res) => {
  try {
    const { id } = req.params;

    const channel = await Channel.findById(id).populate("owner", "fullname email");
    if (!channel) return res.status(404).json({ message: "Channel not found" });
    return res.status(200).json(channel);

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch Channel By Id", error: error.message });
  }
};

export const getChannelSubscribers = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Channel ID is required" });
    }

    const { page, pageSize, skip } = getPaginationParams(req);

    /* ------------------------------------
       1️⃣ Load channel & ownership check
    ------------------------------------ */
    const channel = await Channel.findById(id).lean();

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    if (channel.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Forbidden: not channel owner" });
    }

    /* ------------------------------------
       2️⃣ Paginate subscribers
    ------------------------------------ */

    const filter = { channel: id };

    const [subscriptions, total] = await Promise.all([
      Subscription.find(filter)
        .populate("subscriber", "username fullname email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      Subscription.countDocuments(filter)
    ]);

    // Extract only subscriber objects
    const results = subscriptions.map(s => s.subscriber);

    res.status(200).json({
      channelId: id,
      page,
      pageSize,
      total,
      count: results.length,
      results
    });

  } catch (err) {
    next(err);
  }
};

export const getChannelVideos = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Channel ID is required" });
    }

    const channel = await Channel.findById(id).lean();
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    const { page, pageSize, skip } = getPaginationParams(req);

    const filter = { channelId: id };

    const [videos, total] = await Promise.all([
      Video.find(filter)
        .populate("channelId", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      Video.countDocuments(filter)
    ]);

    res.status(200).json({
      channelId: id,
      page,
      pageSize,
      total,
      count: videos.length,
      results: videos
    });

  } catch (err) {
    next(err);
  }
};

  
// Update Channel by Id
export const updateChannel = async (req, res) => {
  try {
    const { id } = req.params;
    //// To-Do check channel ownership
    const updatedChannel = await Channel.findByIdAndUpdate(id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Validate the new data against the schema
    });

    if (!updatedChannel) return res.status(404).json({ message: "Channel not found" });

    res.status(200).json({ message: "Channel updated successfully", channel: updatedChannel });
  } catch (error) {
    res.status(400).json({ message: "Failed to update channel", error: error.message });
  }
};
  
// Get all Channels or get Channel by Id
export const deleteChannel = async (req, res) => {
  try {
    const { id } = req.params;
    ////To-Do: check channel ownership
    const deletedChannel = await Channel.findByIdAndDelete(id);

    if (!deletedChannel) return res.status(404).json({ message: "Channel not found" });

    res.status(200).json({ message: "Channel deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete channel", error: error.message });
  }
};