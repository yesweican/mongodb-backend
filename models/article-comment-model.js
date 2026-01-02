import mongoose from 'mongoose';
const { Schema } = mongoose;

const articleCommentSchema = new Schema({
    article_id: {
      type: Schema.Types.ObjectId,
      ref: 'Article', // Reference to the related Article
      required: true
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Reference to the user who authored the comment
      required: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    }
  }, { timestamps: true });
  
  const ArticleComment = mongoose.model('ArticleComment', articleCommentSchema);
  export default ArticleComment;
  