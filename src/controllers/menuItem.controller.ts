import catchAsyncErrors from "@/middlewares/catchAsyncErrors";
import MenuItem from "@/models/menuItem.model";
import { sendApiResponse } from "@/utils/utils";
import { Request, Response } from "express";

// export const addMenuItem = catchAsyncErrors(
//   async (req: Request, res: Response) => {
//     const { name, description, price, restaurantId } = req.body;
//     const newMenuItem = new MenuItem({
//       name,
//       description,
//       price,
//       restaurantId,
//     });
//     const savedMenuItem = await newMenuItem.save();
//     return sendApiResponse(
//       res,
//       "success",
//       savedMenuItem,
//       "Menu item added successfully",
//       201
//     );
//   }
// );

// export const getMenuItems = catchAsyncErrors(
//   async (req: Request, res: Response) => {
//     const { restaurantId } = req.params;
//     const menuItems = await MenuItem.find({ restaurantId });
//     return sendApiResponse(
//       res,
//       "success",
//       menuItems,
//       "Menu items fetched successfully",
//       200
//     );
//   }
// );
