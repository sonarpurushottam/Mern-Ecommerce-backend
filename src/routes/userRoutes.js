import { Router } from "express";
import {
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  getUsers,
  getUserById,
} from "../controllers/userController.js";
import { protect, admin, superAdmin } from "../middleware/authMiddleware.js";
import imageUpload from "../config/multerConfig.js";

const userRouter = Router();

userRouter.post("/register", imageUpload.single("profilePic"), registerUser);
userRouter.post("/login", authUser);
userRouter.get("/profile", protect, getUserProfile);

userRouter.put(
  "/profile",
  protect,
  imageUpload.single("profilePic"),
  updateUserProfile
);
userRouter.delete("/:id", protect, admin, deleteUser);
userRouter.get("/", protect, superAdmin, getUsers);
userRouter.get("/:id", protect, superAdmin, getUserById);

export default userRouter;
