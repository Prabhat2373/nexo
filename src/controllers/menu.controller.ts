import { RequestType } from "@/constants/AppConstants";
import catchAsyncErrors from "@/middlewares/catchAsyncErrors";
import MenuItem from "@/models/menuItem.model";
import PredefinedMenuItem from "@/models/predefinedMenuItem";
import Restaurant from "@/models/restaurant.model";
import { sendApiResponse } from "@/utils/utils";
import { Request, Response } from "express";

// Get all predefined menu items
export const getPredefinedMenuItems = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const items = await PredefinedMenuItem.find();
    return sendApiResponse(
      res,
      "success",
      items,
      "Predefined menu items retrieved successfully",
      200
    );
  }
);

// // Add predefined menu items to a restaurant's menu
// export const addRestaurantMenuItem = catchAsyncErrors(
//   async (req: Request, res: Response) => {
//     const { restaurantId } = req.params;
//     const { predefinedMenuItemId, price } = req.body;

//     const newMenuItem = new MenuItem({
//       restaurantId,
//       predefinedMenuItemId,
//       price,
//       isCustom: false,
//     });

//     const savedMenuItem = await newMenuItem.save();
//     return sendApiResponse(
//       res,
//       "success",
//       savedMenuItem,
//       "Menu item added to restaurant successfully",
//       201
//     );
//   }
// );

// // Add custom menu items to a restaurant's menu
// export const addCustomMenuItem = catchAsyncErrors(
//   async (req: Request, res: Response) => {
//     const { restaurantId } = req.params;
//     const { name, price, description } = req.body;

//     const newMenuItem = new MenuItem({
//       restaurantId,
//       name,
//       price,
//       description,
//       isCustom: true,
//     });

//     const savedMenuItem = await newMenuItem.save();
//     return sendApiResponse(
//       res,
//       "success",
//       savedMenuItem,
//       "Custom menu item added to restaurant successfully",
//       201
//     );
//   }
// );

export const addMenuItem = catchAsyncErrors(
  async (req: RequestType, res: Response) => {
    const restaurantId = req.user?.restaurant?.toString();

    const { name, price, description } = req.body;

    const newMenuItem = new MenuItem({
      restaurant: restaurantId,
      name: name,
      price,
      description: description,
      //   isCustom: !predefinedMenuItemId,
    });

    const savedMenuItem = await newMenuItem.save();
    console.log("savedMenuItem", savedMenuItem._id.toString());

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      restaurantId,
      { $push: { menuItems: savedMenuItem._id } }, // Make sure menuItems is an array of ObjectId
      { new: true, useFindAndModify: false } // { new: true } returns the updated document
    ).populate("menuItems"); // Optionally populate to verify

    console.log("updatedRestaurant", updatedRestaurant);
    return sendApiResponse(
      res,
      "success",
      savedMenuItem,
      "Menu item added to restaurant successfully",
      201
    );
  }
);

// Get all menu items for a specific restaurant
export const getRestaurantMenuItems = catchAsyncErrors(
  async (req: RequestType, res: Response) => {
    const restaurant = req.user?.restaurant?.toString();
    const items = await MenuItem.find({ restaurant });
    return sendApiResponse(
      res,
      "success",
      items,
      "Restaurant menu items retrieved successfully",
      200
    );
  }
);
