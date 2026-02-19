import express from "express";
import cors from 'cors';
import dotenv from "dotenv";
import connection from "./db/database.js";
import authRoutes from "./routes/auth-route.js";
import userRoutes from "./routes/user-route.js";
import articleRoutes from "./routes/article-route.js";
import articleCommentRoutes from "./routes/article-comment-route.js";
import videoRoutes from "./routes/video-route.js";
import videoSearchRoutes from "./routes/video-search-route.js"; 
import videoCommentRoutes from "./routes/video-comment-route.js";
import commentRoutes from "./routes/comment-route.js";
import followingRoutes from "./routes/following-route.js";
import followerRoutes from "./routes/follower-route.js";
import channelRoutes from "./routes/channel-route.js";
import channelSubscriberRoutes from "./routes/channel-subscriber-route.js";
import channelVideoRoutes from "./routes/channel-video-route.js";
import subscriberRoutes from "./routes/subscriber-route.js";
import subscriptionRoutes from "./routes/subscription-route.js";
import subscriptionVideoRoutes from "./routes/subscription-video-route.js";
import authenticateToken from "./middleware/auth_middleware.js";

// Get environment variables
dotenv.config()

// Create the express server and configure it to use json
const app = express();
app.use(express.json());

// Configure cors policy
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH","DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Range"],
  exposedHeaders: ["Content-Range", "Accept-Ranges", "Content-Length"]
}));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/article", articleRoutes);
app.use("/api/articlecomments", articleCommentRoutes);
app.use("/api/video", videoRoutes);
app.use("/api/videosearch", videoSearchRoutes);
app.use("/api/videocomments", videoCommentRoutes);  
app.use("/api/comments", commentRoutes);
app.use("/api/following", followingRoutes);
app.use("/api/follower", followerRoutes);
app.use("/api/channel", channelRoutes);
app.use("/api/channelsubscribers", channelSubscriberRoutes);
app.use("/api/channelvideos", channelVideoRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/subsvideos", subscriptionVideoRoutes);
app.use("/api/subscriber", subscriberRoutes);

app.use("/uploads", express.static("uploads"));

// Protected route example
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route' });
});

// Set up a API call with GET method
app.get('/data', (req, res) => {
  // Return some sample data as the response
  res.json({
    message: 'Hello, world!'
  });
});

// Start the server on port configured in .env (recommend port 8000)
app.listen(process.env.PORT, () => {
  console.log(`SERVER IS RUNNING AT PORT ${process.env.PORT}`);
  connection();
});