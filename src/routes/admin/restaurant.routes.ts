import {
  addRestaurant,
  getRestaurantById,
  getRestaurants,
} from "@/controllers/restaurant.controller";
import { addMultipleTables, getTables } from "@/controllers/table.controller";
// import { addTable } from "@/controllers/table.controller";
import { isAdminUser, isAuthenticatedUser } from "@/middlewares/Auth";
import express from "express";

const restaurantRouter = express.Router();
restaurantRouter.post("/restaurants", addRestaurant);

restaurantRouter.use(isAuthenticatedUser);
restaurantRouter.get("/restaurants", getRestaurants);
restaurantRouter.get("/restaurants/:restaurantId", getRestaurantById);
restaurantRouter.post(
  "/restaurants/:restaurantId/tables/:number",

  isAdminUser,
  addMultipleTables
);
restaurantRouter.get(
  "/restaurants/:restaurantId/tables",
  isAuthenticatedUser,
  getTables
);

export default restaurantRouter;
