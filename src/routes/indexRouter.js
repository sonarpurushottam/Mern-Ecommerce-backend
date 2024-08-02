import express from "express";
import userRouter from "./userRouter.js";
import categoryRouter from "./categoryRouter.js";
import brandRouter from "./brandRouter.js";
import productRouter from "./productRouter.js";
import cartRouter from "./cartRouter.js";
import wishlistRouter from "./wishlistRouter.js";
import orderRouter from "./orderRouter.js";
import addressRouter from "./addressRouter.js";
import reviewRouter from "./reviewRouter.js";
// import adminRouter from "./adminRouter.js";
import shippingRouter from "./shippingRouter.js";

const router = express.Router();

router.use("/users", userRouter);
router.use("/categories", categoryRouter);
router.use("/brands", brandRouter);
router.use("/products", productRouter);
router.use("/cart/", cartRouter);
router.use("/wishlist", wishlistRouter);
router.use("/orders", orderRouter);
router.use("/address", addressRouter);
router.use("/reviewRouter", reviewRouter);
router.use("/shipping", shippingRouter);
// router.use("/admin", adminRouter);

export default router;
