// controllers/postController.js
import Channel from '../models/channel-model.js';

// Create a new channel
export const createChannel = async (req, res) => {
  const { name, description } = req.body;
  //console.log('last user:'+ req.user);  // the user<=userId from middleware
  try {
    //console.log('User Id:', req.user);
    const newChannel = new Channel({ name, description, owner: req.user});
    const savedChannel= await newChannel.save();

    res.status(201).json({ message: 'Channel created successfully', channel: savedChannel });
  } catch (error) {
    //console.error('Error creating channel:', error);
    res.status(500).json({ message: 'Failed to create Channel, author=>'+user, error: error.message });
  }
};

// Get all My Channels
export const getMyChannels = async (req, res) => {
  try {
    const { userid } = req.user;

    const channels = await Channel.find({ owner: userid }).populate("owner", "fullname email");
    res.status(200).json(channels);
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