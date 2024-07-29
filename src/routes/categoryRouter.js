import express from "express";
const router = express.Router();
import {
  createCategory,
  updateCategory,
  removeCategory,
  listCategory,
  readCategory,
} from "../controllers/categoryController.js";
import { protect, admin, superAdmin } from "../middleware/authMiddleware.js";

router.post("/create", protect, admin, createCategory);
router.put("/:categoryId", protect, admin, updateCategory);
router.delete("/:categoryId", protect, admin, removeCategory);

router.get("/get", listCategory);
router.get("/:id", readCategory);

export default router;
