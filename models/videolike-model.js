import mongoose from 'mongoose';
const { Schema } = mongoose;

const videoLikeSchema = new Schema({
  video: {
    type: Schema.Types.ObjectId,
    ref: 'Video',
    required: true
  },
  viewer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

videoLikeSchema.index({ viewer: 1, video: 1 }, { unique: true });
videoLikeSchema.index({ viewer: 1 });
videoLikeSchema.index({ video: 1 });

const VideoLike = mongoose.model('VideoLike', videoLikeSchema);
export default VideoLike;