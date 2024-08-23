import express from "express";
const router = express.Router();
import {
  createBrand,
  updateBrand,
  removeBrand,
  listBrands,
  listBrandsByCategory,
  readBrand,
  getBrandsByCategory
} from "../controllers/brandController.js";
import { protect, admin, superAdmin, demoViewer } from "../middleware/authMiddleware.js";
import imageUpload from "../config/multerConfig.js";

// Routes for brand management with image upload middleware
// Create a new brand - restricted to admin users
router.post(
  "/create",
  protect,
  admin,
  demoViewer, // Prevent demo users from creating brands
  imageUpload.single("brandImage"),
  createBrand
);

// Update an existing brand - restricted to admin users
router.put(
  "/:brandId",
  protect,
  admin,
  demoViewer, // Prevent demo users from updating brands
  imageUpload.single("brandImage"),
  updateBrand
);

// Delete a brand - restricted to admin users
router.delete(
  "/:brandId",
  protect,
  admin,
  demoViewer, // Prevent demo users from deleting brands
  removeBrand
);

// List all brands - accessible by everyone, including viewers
router.get("/get", listBrands);

// List brands by category - accessible by everyone, including viewers
router.get("/category/:categoryId", listBrandsByCategory);

// Read a single brand by ID - accessible by everyone, including viewers
router.get("/:id", readBrand);

// Get brands by category - accessible by everyone, including viewers
router.get('/getByCategory/:categoryId', getBrandsByCategory);

export default router;
