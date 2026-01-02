import mongoose from 'mongoose';
const { Schema } = mongoose;

const articleSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  details: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

const Article = mongoose.model('Article', articleSchema);
export default Article;
