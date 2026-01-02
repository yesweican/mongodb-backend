import User from "../models/user-model.js";

export const getUser = async (req, res) => {
  try {
    const { username } = req.params;

    // Find the user by _id or username
    const user = await User.findOne({
          $or: [{ _id: username }, { username: username }],
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user", error: error.message });
  }
};


export const getUserExtended = async (req, res) => {
  try {
    const { username } = req.params;

    // Find the user by _id or username
    const user = await User.findOne({
          $or: [{ _id: username }, { username: username }],
    })//.select("fullname email username")
    .populate({
        path: "articles", // Include user's articles (optional)
      select: "title details createdAt",});


    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user", error: error.message });
  }
};