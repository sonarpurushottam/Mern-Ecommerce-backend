// backend/models/Wishlist.js
import mongoose from 'mongoose';

const wishlistItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  }
});

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [wishlistItemSchema]
});

export default mongoose.model('Wishlist', wishlistSchema);
