import mongoose from 'mongoose';
const { Schema } = mongoose;

const videoSchema = new Schema({
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
    required: false,
    trim: true
  },
  alterURL: {
    type: String,
    required: false,
    trim: true
  }, 
	channelId: {
		type: Schema.Types.ObjectId,
		ref: 'Channel',
		required: false
	},
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

const Video = mongoose.model('Video', videoSchema);
export default Video;