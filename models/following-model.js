import mongoose from 'mongoose';
const { Schema } = mongoose;

const followingSchema = new Schema({
  followed: {
    type: Schema.Types.ObjectId,
    ref: 'User',
      required: true
    },
  following: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

const Following = mongoose.model('Following', followingSchema);
export default Following;