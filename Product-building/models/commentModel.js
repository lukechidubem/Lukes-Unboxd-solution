const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: [true, 'Comment can not be empty!'],
    },
    name: {
      type: String,
      required: [true, 'Comment must have a commenter name!'],
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: [true, 'Comment must belong to a product.'],
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Comment must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

commentSchema.index({ product: 1, user: 1 }, { unique: true });

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
