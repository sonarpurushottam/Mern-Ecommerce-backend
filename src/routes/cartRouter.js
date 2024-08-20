// backend/routes/cartRoutes.js
import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  getCartItemCount,
  clearCart,
} from "../controllers/cartController.js";

import { protect } from "../middleware/authMiddleware.js";

const cartRouter = express.Router();

cartRouter.get("/", protect, getCart);
cartRouter.post("/", protect, addToCart);
cartRouter.put("/", protect, updateCartItem);
cartRouter.delete("/:itemId", protect, removeFromCart);
cartRouter.get("/item-count", protect, getCartItemCount);
cartRouter.delete("/", protect, clearCart);

export default cartRouter;
