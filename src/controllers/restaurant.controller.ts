import catchAsyncErrors from "@/middlewares/catchAsyncErrors";
import UserAccount, { UserRole } from "@/models/account.model";
import Restaurant from "@/models/restaurant.model";
import { sendApiResponse } from "@/utils/utils";
import { Request, Response } from "express";

export const addRestaurant = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const { name, address, email, phone, password } = req.body;

    const newRestaurant = new Restaurant({
      name,
      address,
      email,
      phone,
      menuItems: [],
    });
    const savedRestaurant = await newRestaurant.save();

    await UserAccount.create({
      name,
      email,
      password,
      role: UserRole.ADMIN,
      restaurant: savedRestaurant?._id,
    });

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
    const restaurants = await Restaurant.find().populate([
      {
        path: "menuItems",
        // model: MenuItem,
        select: "name description price",
      },
    ]);
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
