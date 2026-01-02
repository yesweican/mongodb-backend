// controllers/postController.js
import Following from '../models/following-model.js';

// Create a new following
export const createFollowing = async (req, res) => {
  const { followed } = req.body;
  //console.log('last user:'+ req.user);  // the user<=userId from middleware
  try {
    //console.log('User Id:', req.user);
    const newFollowing = new Following({ followed: followed, following: req.user});
    const savedFollowing= await newFollowing.save();

    res.status(201).json({ message: 'Following created successfully', following: savedFollowing });
  } catch (error) {
    //console.error('Error creating following:', error);
    res.status(500).json({ message: 'Failed to create Following, author=>'+user, error: error.message });
  }
};

// Get all MY Followings or get Following by Id
export const getFollowings = async (req, res) => {
  try {
    const { id } = req.params;
    if (id) {
      const following = await Following.find({ followed: id, following: req.user } );
      if (!following) return res.status(404).json({ message: "Following not found" });
      return res.status(200).json(following);
    }

    const followings = await Following.findAll({following: req.user});
    res.status(200).json(followings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch Followings", error: error.message });
  }
};

  // Get all MY Followers or get Follower by Id
export const getFollowers = async (req, res) => {
  try {
    const { id } = req.params;
    if (id) {
      const follower = await Following.find({followed: req.user, following:id });
      if (!follower) return res.status(404).json({ message: "Follower not found" });
      return res.status(200).json(follower);
    }

    const followings = await Following.findAll({followed: req.user});
    res.status(200).json(followings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch Followings", error: error.message });
  }
};
  
// Delete Following by Id
export const deleteFollowing = async (req, res) => {
  try {
    const { id } = req.params;
    ////To-Do: check Following ownership
    const deletedFollowing = await Following.findByIdAndDelete(id);

    if (!deletedFollowing) return res.status(404).json({ message: "Following not found" });

    res.status(200).json({ message: "Following deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete following", error: error.message });
  }
};