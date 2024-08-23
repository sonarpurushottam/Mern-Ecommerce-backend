import express from "express";
import { protect, demoViewer } from "../middleware/authMiddleware.js";
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

// Get all orders for the authenticated user (with optional filters and sorting)
orderRouter.get("/", protect, demoViewer, getOrders);

// Get a specific order by ID for the authenticated user
orderRouter.get("/:id", protect, demoViewer, getOrderById);

// Create a new order
orderRouter.post("/", protect, demoViewer, createOrder);

// Update the status of an order (admin only)
orderRouter.put("/:id", protect, demoViewer, updateOrderStatus);

// Delete (cancel) an order
orderRouter.delete("/:id", protect, demoViewer, deleteOrder);

export default orderRouter;
