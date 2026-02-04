import mongoose from 'mongoose';
const { Schema } = mongoose;

const videoSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    videoURL: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    alterURL: {
      type: String,
      trim: true
    },
    channelId: {
      type: Schema.Types.ObjectId,
      ref: 'Channel'
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

/**
 * Text index with weights
 * NOTE: MongoDB allows only ONE text index per collection
 */
videoSchema.index(
  {
    title: 'text',
    description: 'text'
  },
  {
    weights: {
      title: 10,
      description: 5
    },
    name: 'VideoTextSearchIndex'
  }
);

videoSchema.index({ channelId: 1, createdAt: -1 });

const Video = mongoose.model('Video', videoSchema);
export default Video;
