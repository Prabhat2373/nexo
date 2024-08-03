import { createOrder, getAllOrders } from "@/controllers/order.controller";
import { isAdminUser, isAuthenticatedUser } from "@/middlewares/Auth";
import { Router } from "express";

const orderRouter = Router();
orderRouter.use(isAuthenticatedUser);

orderRouter.post("/restaurants/:restaurantId/orders", createOrder);
orderRouter.get("/restaurants/:restaurantId/orders", isAdminUser, getAllOrders);
// orderRouter.get("/restaurants/:restaurantId/orders", isAdminUser, getAllOrders);

export default orderRouter