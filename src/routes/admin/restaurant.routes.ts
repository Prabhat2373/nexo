import {
  addRestaurant,
  getRestaurantById,
  getRestaurants,
} from "@/controllers/restaurant.controller";
import { addMultipleTables } from "@/controllers/table.controller";
// import { addTable } from "@/controllers/table.controller";
import { isAdminUser, isAuthenticatedUser } from "@/middlewares/Auth";
import express from "express";

const restaurantRouter = express.Router();
restaurantRouter.use(isAuthenticatedUser);

restaurantRouter.post("/restaurants", addRestaurant);
restaurantRouter.get("/restaurants", getRestaurants);
restaurantRouter.get("/restaurants/:restaurantId", getRestaurantById);
restaurantRouter.post(
  "/restaurants/:restaurantId/tables/:number",

  isAdminUser,
  addMultipleTables
);

export default restaurantRouter;
