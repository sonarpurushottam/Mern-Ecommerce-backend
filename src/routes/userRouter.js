import { Router } from "express";
import {
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  getUsers,
  getUserById,
  logoutUser, // Import the new logout function
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
userRouter.get("/", protect, admin, getUsers);
userRouter.get("/:id", protect, getUserById);
userRouter.post("/logout", protect, logoutUser); // Add the logout route

export default userRouter;
