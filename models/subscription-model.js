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

subscriptionSchema.index({ subscriber: 1, channel: 1 }, { unique: true });
subscriptionSchema.index({ channel: 1, createdAt: -1 });
subscriptionSchema.index({ subscriber: 1 });

const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription;