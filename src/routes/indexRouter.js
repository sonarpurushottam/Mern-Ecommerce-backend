// backend/src/routes/indexRouter.js
import express from "express";
import userRouter from "./userRouter.js";
import categoryRouter from "./categoryRouter.js";
import brandRouter from "./brandRouter.js";
import productRouter from "./productRouter.js";
import cartRouter from "./cartRouter.js";
import wishlistRouter from "./wishlistRouter.js";
import orderRouter from "./orderRouter.js";
import reviewRouter from "./reviewRouter.js";
import shippingRouter from "./shippingRouter.js";
import addressRoutes from "./addressRouter.js";

const router = express.Router();

router.use("/users", userRouter);
router.use("/categories", categoryRouter);
router.use("/brands", brandRouter);
router.use("/products", productRouter);
router.use("/cart", cartRouter);
router.use("/wishlist", wishlistRouter);
router.use("/orders", orderRouter);
router.use("/addresses", addressRoutes);
router.use("/review", reviewRouter);
router.use("/shipping", shippingRouter);

export default router;
