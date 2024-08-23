import express from "express";
const router = express.Router();
import {
  createBrand,
  updateBrand,
  removeBrand,
  listBrands,
  listBrandsByCategory,
  readBrand,
} from "../controllers/brandController.js";
import { protect, admin, superAdmin } from "../middleware/authMiddleware.js";
import imageUpload from "../config/multerConfig.js";
import { getBrandsByCategory } from '../controllers/brandController.js';

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

router.get("/get", listBrands); 
router.get("/category/:categoryId", listBrandsByCategory); 
router.get("/:id", readBrand);
router.get('/getByCategory/:categoryId', getBrandsByCategory);

export default router;
