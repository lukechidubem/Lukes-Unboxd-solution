const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      required: [true, 'A product must have a name'],
      trim: true,
    },

    slug: String,

    product_price: {
      type: Number,
      required: [true, 'A Product must have a price'],
    },

    product_description: {
      type: String,
      trim: true,
      required: [true, 'A Product must have a description'],
    },

    product_image: {
      type: String,
      required: [true, 'A product must have an image'],
    },

    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Product must belong to a user'],
    },

    product_views: {
      type: Number,
      default: 0,
    },

    product_views_list: [],
    product_vote_list: [],

    vote: {
      type: Number,
      default: 0,
    },
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual populate
productSchema.virtual('comments', {
  ref: 'Comment',
  foreignField: 'product',
  localField: '_id',
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
