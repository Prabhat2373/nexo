import catchAsyncErrors from "@/middlewares/catchAsyncErrors";
import Restaurant from "@/models/restaurant.model";
import { sendApiResponse } from "@/utils/utils";
import { Request, Response } from "express";

export const addRestaurant = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const { name, address, email, phone } = req.body;
    const newRestaurant = new Restaurant({ name, address, email, phone });
    const savedRestaurant = await newRestaurant.save();
    return sendApiResponse(
      res,
      "success",
      savedRestaurant,
      "Restaurant added successfully",
      201
    );
  }
);

export const getRestaurants = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const restaurants = await Restaurant.find();
    return sendApiResponse(
      res,
      "success",
      restaurants,
      "Restaurants fetched successfully",
      200
    );
  }
);

export const getRestaurantById = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const { restaurantId } = req.params;
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return sendApiResponse(res, "error", null, "Restaurant not found", 404);
    }
    return sendApiResponse(
      res,
      "success",
      restaurant,
      "Restaurant fetched successfully",
      200
    );
  }
);
