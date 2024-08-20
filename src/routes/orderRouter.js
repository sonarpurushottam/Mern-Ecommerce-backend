import express from "express";
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
  // deleteOrderById,
} from "../controllers/orderController.js";

import { protect } from "../middleware/authMiddleware.js";

const orderRouter = express.Router();

// Get all orders for the authenticated user (with optional filters and sorting)
orderRouter.get("/", protect, getOrders);

// Get a specific order by ID for the authenticated user
orderRouter.get("/:id", protect, getOrderById);

// Create a new order
orderRouter.post("/", protect, createOrder);

// Update the status of an order (admin only)
orderRouter.put("/:id", protect, updateOrderStatus);

// Delete (cancel) an order
orderRouter.delete("/:id", protect, deleteOrder);
// orderRouter.delete("/:id", protect, deleteOrderById);
export default orderRouter;
