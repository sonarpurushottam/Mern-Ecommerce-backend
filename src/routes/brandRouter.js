import express from "express";
import {
  createBrand,
  updateBrand,
  removeBrand,
  listBrand,
  readBrand,
} from "../controllers/brandController.js";
import { protect, admin, superAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, admin, createBrand);
router.put("/:brandId", protect, admin, updateBrand);
router.delete("/:brandId", protect, admin, removeBrand);
router.get("/get", listBrand);
router.get("/:id", readBrand);

export default router;
