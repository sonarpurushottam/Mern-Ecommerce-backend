// backend/routes/shippingRoutes.js
import express from "express";
import {
  getShippingOptions,
  addShippingAddress,
  updateShippingAddress,
  deleteShippingAddress,
} from "../controllers/shippingController.js";

import { protect } from "../middleware/authMiddleware.js";

const shippingRouter = express.Router();

shippingRouter.get("/", protect, getShippingOptions);
shippingRouter.post("/", protect, addShippingAddress);
shippingRouter.put("/:id", protect, updateShippingAddress);
shippingRouter.delete("/:id", protect, deleteShippingAddress);

export default shippingRouter;
