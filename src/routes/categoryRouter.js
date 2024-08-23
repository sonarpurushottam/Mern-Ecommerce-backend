import express from "express";
const router = express.Router();
import {
  createCategory,
  updateCategory,
  removeCategory,
  listCategories,
  readCategory,
} from "../controllers/categoryController.js";
import { protect, admin, demoViewer } from "../middleware/authMiddleware.js";
import imageUpload from "../config/multerConfig.js";

// Routes for category management with image upload middleware
// Create a new category - restricted to admin users
router.post(
  "/create",
  protect,
  admin,
  demoViewer, // Prevent demo users from creating categories
  imageUpload.single("categoryImage"),
  createCategory
);

// Update an existing category - restricted to admin users
router.put(
  "/:categoryId",
  protect,
  admin,
  demoViewer, // Prevent demo users from updating categories
  imageUpload.single("categoryImage"),
  updateCategory
);

// Delete a category - restricted to admin users
router.delete(
  "/:categoryId",
  protect,
  admin,
  demoViewer, // Prevent demo users from deleting categories
  removeCategory
);

// List all categories - accessible by everyone, including viewers
router.get("/get", listCategories);

// Read a single category by ID - accessible by everyone, including viewers
router.get("/:id", readCategory);

export default router;
