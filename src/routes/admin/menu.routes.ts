import {
  addMenuItem,
  getPredefinedMenuItems,
  getRestaurantMenuItems,
} from "@/controllers/menu.controller";
import { isAdminUser } from "@/middlewares/Auth";
import { Router } from "express";

// import { isAuthenticatedRestaurant } from "../middleware/auth";

const menuRouter = Router();

// Get all predefined menu items
menuRouter.get("/predefined-menu-items", getPredefinedMenuItems);

// Add predefined menu items to a restaurant's menu
menuRouter.post(
  "/restaurants/:restaurantId/menu-items",
  isAdminUser,
  addMenuItem
);

// // Add custom menu items to a restaurant's menu
// menuRouter.post(
//   "/restaurants/:restaurantId/custom-menu-items",
//   isAdminUser,
//   addCustomMenuItem
// );

// Get all menu items for a specific restaurant
menuRouter.get(
  "/restaurants/:restaurantId/menu-items",
  isAdminUser,
  getRestaurantMenuItems
);

export default menuRouter;
