// routes/discountRoutes.ts
import express from "express";
import {
  addCoupon,
  getCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
} from "@/controllers/coupon.controller";
import { isAdminUser, isAuthenticatedUser } from "@/middlewares/Auth";
// import { isAuthenticatedRestaurant } from "@/middlewares/auth";

const couponRouter = express.Router();

couponRouter.use(isAuthenticatedUser, isAdminUser);

couponRouter.route("/coupons");

couponRouter.post("/", addCoupon);
couponRouter.get("/:id", getCoupon);
couponRouter.get("/", getAllCoupons);
couponRouter.put("/:id", updateCoupon);
couponRouter.delete("/:id", deleteCoupon);

export default couponRouter;
