import express from "express";
import {
  getAllProductsHandler,
  uploadProductHandler,
  getProductByIdHandler,
  updateProductByIdHandler,
  deleteProductByIdHandler,
  getProductsByBrand,
  getProductsByCategory, // New function
} from "../controllers/productController.js";
import { protect, admin, superAdmin } from "../middleware/authMiddleware.js";
import imageUpload from "../config/multerConfig2.js";

const router = express.Router();

router.post(
  "/upload",
  protect,
  admin,
  imageUpload.array("productImage"),
  uploadProductHandler
);

router.get("/all-products", getAllProductsHandler);

router.get("/:id", getProductByIdHandler);

router.put(
  "/:id",
  protect,
  admin,
  imageUpload.array("newImages"),
  updateProductByIdHandler
);

router.delete("/:id", protect, admin, deleteProductByIdHandler);

router.get("/brand/:brandId", getProductsByBrand); // New route
router.get("/category/:categoryId", getProductsByCategory);

export default router;