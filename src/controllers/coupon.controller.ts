// controllers/discountController.ts
import { Request, Response, NextFunction } from "express";
// import Coupon from "@/models/Coupon";
import catchAsyncErrors from "@/middlewares/catchAsyncErrors";
import Coupon from "@/models/coupon.model";
import { sendApiResponse } from "@/utils/utils";
import { responseType } from "@/constants/AppConstants";
// import sendApiResponse from "@/utils/sendApiResponse";

export const addCoupon = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { code, percentage, validFrom, validTo, restaurantId } = req.body;

    const discount = await Coupon.create({
      code,
      percentage,
      validFrom,
      validTo,
      restaurantId,
    });

    return sendApiResponse(
      res,
      "success",
      discount,
      "Coupon added successfully",
      201
    );
  }
);

export const getCoupon = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const discount = await Coupon.findById(id);

    return sendApiResponse(
      res,
      "success",
      discount,
      "Coupon retrieved successfully"
    );
  }
);

export const getAllCoupons = catchAsyncErrors(
  async (req: Request, res: responseType, next: NextFunction) => {
    const discounts = await Coupon.find({ restaurantId: req.user?.id });

    return sendApiResponse(
      res,
      "success",
      discounts,
      "Coupons retrieved successfully"
    );
  }
);

export const updateCoupon = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { code, percentage, validFrom, validTo } = req.body;

    const discount = await Coupon.findByIdAndUpdate(
      id,
      { code, percentage, validFrom, validTo },
      { new: true }
    );

    return sendApiResponse(
      res,
      "success",
      discount,
      "Coupon updated successfully"
    );
  }
);

export const deleteCoupon = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    await Coupon.findByIdAndDelete(id);

    return sendApiResponse(res, "success", null, "Coupon deleted successfully");
  }
);
