import mongoose from 'mongoose';
const { Schema } = mongoose;

const channelSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

const Channel = mongoose.model('Channel', channelSchema);
export default Channel;