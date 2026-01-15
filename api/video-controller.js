// controllers/videoController.js
// import path from "path";
// import fs from "fs";
import Video from '../models/video-model.js';

// Create a new video
export const createVideo = async (req, res) => {

  const file = req.file; // Multer processes 'file' field
  const { title, videoURL, description, alterURL} = req.body;
  //console.log('last user:'+ req.user);  // the user<=userId from middleware
  try {
    // Validate input
    if (!file) {
      return res.status(400).json({ message: "No file uploaded!" });
    }
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required!" });
    }

    // Optionally: Save the file to cloud storage (e.g., AWS S3, Azure Blob, GCP)
    // For now, we'll just rename the file to its original name for demonstration.
    // const targetPath = path.join(__dirname, "uploads", file.originalname);
    // fs.renameSync(file.path, targetPath); // Move and rename the file

    //console.log('User Id:', req.user);
    const newVideo = new Video({
      title,
      videoURL: "test URL",
      description,
      alterURL,
      creator: req.user,
      //channelId: req.user.defaultChannelId
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
    //console.error('Error creating video:', error);
    res.status(500).json({ message: 'Failed to create Video, author=>'+req.user, error: error.message });
  }

    // Cleanup: Delete file from server if uploaded to cloud (optional)
    // fs.unlinkSync(targetPath);
};

// Get all Videos or get Video by Id
export const getMyVideos = async (req, res) => {
  try {
    const videos = await Video.find({ creator: req.user });
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch My Videos", error: error.message });
  }
};

export const getVideoById = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id);
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
      return res.status(400).json({ message: 'Search term is required' });
    }

    const results = await Video.find(
      { $text: { $search: q } },
      {
        score: { $meta: 'textScore' }
      }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(20)
      .populate('creator', 'username fullname');
      //.populate('channelId', 'name');

    res.status(200).json({
      query: q,
      count: results.length,
      results
    });
  } catch (error) {
    res.status(500).json({
      message: 'Video search failed',
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