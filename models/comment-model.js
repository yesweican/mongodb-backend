import mongoose from 'mongoose';
const { Schema } = mongoose;

const commentSchema = new Schema({
    video_id: {
      type: Schema.Types.ObjectId,
      ref: 'Video', // Reference to the related Video
      required: true
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Reference to the user who authored the comment
      required: true
    },
    details: {
      type: String,
      required: true,
      trim: true
    },
    deleted: {
      type: Boolean,
      default: false
    }
  }, { timestamps: true });

  const Comment = mongoose.model('Comment', commentSchema);
  export default Comment;