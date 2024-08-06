import express from "express";
const router = express.Router();
import {
  createCategory,
  updateCategory,
  removeCategory,
  listCategories, // Changed from listCategory
  readCategory,
} from "../controllers/categoryController.js";
import { protect, admin, superAdmin } from "../middleware/authMiddleware.js";
import imageUpload from "../config/multerConfig.js";

// Routes for category management with image upload middleware
router.post(
  "/create",
  protect,
  admin,
  imageUpload.single("categoryImage"),
  createCategory
);
router.put(
  "/:categoryId",
  protect,
  admin,
  imageUpload.single("categoryImage"),
  updateCategory
);
router.delete("/:categoryId", protect, admin, removeCategory);

router.get("/get", listCategories); // Changed route
router.get("/:id", readCategory);

export default router;
