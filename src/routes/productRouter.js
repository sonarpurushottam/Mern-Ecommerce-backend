import express from "express";
import {
  getAllProductsHandler,
  uploadProductHandler,
  getProductByIdHandler,
  updateProductByIdHandler,
  deleteProductByIdHandler,
  getProductsByBrand,
  getProductsByCategory
} from "../controllers/productController.js";
import { protect, admin, demoViewer } from "../middleware/authMiddleware.js";
import imageUpload from "../config/multerConfig2.js";

const router = express.Router();

// Route to upload a new product
router.post(
  "/upload",
  protect,
  admin,
  demoViewer,
  imageUpload.array("productImage"),
  uploadProductHandler
);

// Route to get all products
router.get("/all-products", getAllProductsHandler);

// Route to get a single product by ID
router.get("/:id", getProductByIdHandler);

// Route to update a product by ID
router.put(
  "/:id",
  protect,
  admin,
  demoViewer,
  imageUpload.array("newImages"),
  updateProductByIdHandler
);

// Route to delete a product by ID
router.delete(
  "/:id",
  protect,
  admin,
  demoViewer,
  deleteProductByIdHandler
);

// Route to get products by brand
router.get("/brand/:brandId", getProductsByBrand);

// Route to get products by category
router.get("/category/:categoryId", getProductsByCategory);

export default router;
