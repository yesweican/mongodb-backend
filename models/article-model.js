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
  },
  imageURL: {
    type: String,
    trim: true
  },
}, { timestamps: true });

articleSchema.index({
  title: "text",
  details: "text"
});

const Article = mongoose.model('Article', articleSchema);
export default Article;
