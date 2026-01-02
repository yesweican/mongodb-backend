import mongoose from 'mongoose';
const { Schema } = mongoose;

const subscriptionSchema = new Schema({
  channel: {
    type: Schema.Types.ObjectId,
    ref: 'Channel',
      required: true
    },
  subscriber: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription;