// backend/routes/orderRoutes.js
import express from "express";
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
  // getOrdersByUserEmailOrName,
} from "../controllers/orderController.js";

import { protect, admin } from "../middleware/authMiddleware.js";

const orderRouter = express.Router();

orderRouter.get("/", protect, admin, getOrders);
orderRouter.get("/:id", protect, getOrderById);
orderRouter.post("/", protect, createOrder);
orderRouter.put("/:id", protect, admin, updateOrderStatus);
orderRouter.delete("/:id", protect, deleteOrder);
// orderRouter.get('/user/:emailOrName',  getOrdersByUserEmailOrName);

export default orderRouter;
