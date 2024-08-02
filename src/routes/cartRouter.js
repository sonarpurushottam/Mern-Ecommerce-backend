// backend/routes/cartRoutes.js
import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
} from "../controllers/cartController.js";

import { protect } from "../middleware/authMiddleware.js";

const cartRouter = express.Router();

cartRouter.get("/", protect, getCart);
cartRouter.post("/", protect, addToCart);
cartRouter.put("/", protect, updateCartItem);
cartRouter.delete("/:itemId", protect, removeFromCart);

export default cartRouter;
