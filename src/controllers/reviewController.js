// backend/controllers/reviewController.js
import Review from '../models/reviewModel.js';

export const addReview = async (req, res) => {
  const { rating, comment } = req.body;

  try {
    const review = new Review({
      productId: req.params.id,
      userId: req.user.id,
      rating,
      comment
    });

    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.id });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) return res.status(404).json({ message: 'Review not found' });

    if (review.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized action' });
    }

    await review.remove();
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
