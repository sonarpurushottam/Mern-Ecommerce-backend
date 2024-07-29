import express from "express";
import {
  getAllProductsHandler,
  uploadProductHandler,
  getProductByIdHandler,
  updateProductByIdHandler,
  deleteProductByIdHandler,
} from "../controllers/productController.js";
import { protect, admin, superAdmin } from "../middleware/authMiddleware.js";
import imageUpload from "../config/multerConfig2.js";

const router = express.Router();

router.post(
  "/upload",
  protect,
  admin, // Use admin middleware to restrict access to admins
  imageUpload.array("productImage"),
  uploadProductHandler
);

router.get("/all-products", getAllProductsHandler);

router.get("/:id", getProductByIdHandler);

router.put(
  "/:id",
  protect,
  admin, // Use admin middleware to restrict access to admins
  imageUpload.array("newImages"),
  updateProductByIdHandler
);

router.delete(
  "/:id",
  protect,
  admin, // Use admin middleware to restrict access to admins
  deleteProductByIdHandler
);

export default router;
