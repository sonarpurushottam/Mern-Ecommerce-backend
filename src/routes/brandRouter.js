import express from "express";
const router = express.Router();
import {
  createBrand,
  updateBrand,
  removeBrand,
  listBrand,
  readBrand,
} from "../controllers/brandController.js";
import { protect, admin, superAdmin } from "../middleware/authMiddleware.js";
import imageUpload from "../config/multerConfig.js"; // Adjust the path if necessary

// Routes for brand management with image upload middleware
router.post(
  "/create",
  protect,
  admin,
  imageUpload.single("brandImage"),
  createBrand
);
router.put(
  "/:brandId",
  protect,
  admin,
  imageUpload.single("brandImage"),
  updateBrand
);
router.delete("/:brandId", protect, admin, removeBrand);

router.get("/get", listBrand);
router.get("/:id", readBrand);

export default router;
