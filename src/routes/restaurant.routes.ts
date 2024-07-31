import {
  addRestaurant,
  getRestaurantById,
  getRestaurants,
} from "@/controllers/restaurant.controller";
import express from "express";

const restaurantRouter = express.Router();

restaurantRouter.post("/restaurants", addRestaurant);
restaurantRouter.get("/restaurants", getRestaurants);
restaurantRouter.get("/restaurants/:restaurantId", getRestaurantById);

export default restaurantRouter;
