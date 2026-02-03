// controllers/postController.js
import Subscription from '../models/subscription-model.js';
import Channel from '../models/channel-model.js';

// Create a new subscription
export const subscribe = async (req, res) => {
  const { id } = req.params;
  console.log('last user:'+ req.user);  // the user<=userId from middleware
  try {
    const newSubscription = new Subscription({ channel: id, subscriber: req.user.userId});
    const savedSubscription= await newSubscription.save();

    res.status(201).json({ message: 'Subscription created successfully', subscription: savedSubscription });
  } catch (error) {
    //console.error('Error creating following:', error);
    res.status(500).json({ message: 'Failed to create Subscription, author=>'+user, error: error.message });
  }
};

// Get all My Subscriptions/channels
export const getMySubscriptions = async (req, res) => {
  try {
    // const { id } = req.params;
    // if (id) {
    //   const subscription = await Subscription.findById(id).populate("author", "fullname email");
    //   if (!subscription) return res.status(404).json({ message: "Subscription not found" });
    //   return res.status(200).json(subscription);
    // }

    const subscriptions = await Subscription.findAll({subscriber: req.user.id}).populate("channel", "name, description");
    res.status(200).json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch Subscriptions", error: error.message });
  }
};

// Get all My channel's subscribers
export const getSubscribers = async (req, res) => {
  try {
    const { chanid } = req.params;
    if (chanid) {
       const channel = await Channel.find({id: chanid, owner:req.user.id});
       if (!channel) return res.status(404).json({ message: "Channel not found" });
       return res.status(200).json(subscription);
    }

    const subscribers = await Subscription.findAll({channel: chanid}).populate("subscriber", "id, username");
    res.status(200).json(subscribers);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch Subscriptions", error: error.message });
  }
};
  
// Delete Subscription by Id
export const unsubscribe = async (req, res) => {
  try {
    const { id } = req.params;
    //To-Do, check my ownership
    const deletedSubscription = await Subscription.findByIdAndDelete(id);

    if (!deletedSubscription) return res.status(404).json({ message: "Subscription not found" });

    res.status(200).json({ message: "Subscription deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete subscription", error: error.message });
  }
};