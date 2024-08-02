// backend/routes/paymentRoutes.js
import express from "express";
import {
  processPayment,
  getPaymentDetails,
} from "../controllers/paymentController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

paymentRouter.post("/", protect, processPayment);
paymentRouter.get("/:id", protect, getPaymentDetails);

export default paymentRouter;
