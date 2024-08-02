// backend/routes/reviewRoutes.js
import express from "express";
import {
  addReview,
  getProductReviews,
  deleteReview,
} from "../controllers/reviewController.js";

import { protect } from "../middleware/authMiddleware.js";

const reviewRouter = express.Router();

reviewRouter.post("/:id/reviews", protect, addReview);
reviewRouter.get("/:id/reviews", getProductReviews);
reviewRouter.delete("/:id/reviews/:reviewId", protect, deleteReview);

export default reviewRouter;
