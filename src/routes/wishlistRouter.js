// backend/routes/wishlistRoutes.js
import express from 'express';
import { getWishlist, addToWishlist, removeFromWishlist } from '../controllers/wishlistController.js';

import { protect } from '../middleware/authMiddleware.js';

const wishlistRouter = express.Router();

wishlistRouter.get('/', protect, getWishlist);
wishlistRouter.post('/', protect, addToWishlist);
wishlistRouter.delete('/:itemId', protect, removeFromWishlist);

export default wishlistRouter;
