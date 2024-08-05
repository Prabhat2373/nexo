import {
  completeOrder,
  createOrder,
  getAllOrders,
} from "@/controllers/order.controller";
import {
  confirmCashPayment,
  initiatePayment,
} from "@/controllers/payment.controller";
import { isAdminUser, isAuthenticatedUser } from "@/middlewares/Auth";
import { Router } from "express";

const orderRouter = Router();
orderRouter.use(isAuthenticatedUser);

orderRouter.post(
  "/restaurants/:restaurantId/tables/:tableId/orders",
  createOrder
);
orderRouter.post(
  "/restaurants/:orderId/initiate-payment",
  isAuthenticatedUser,
  initiatePayment
);

orderRouter.post(
  "/restaurants/confirm-cash-payment",
  isAuthenticatedUser,
  confirmCashPayment
);

orderRouter.get("/restaurants/:restaurantId/orders", isAdminUser, getAllOrders);
orderRouter.post(
  "/restaurants/:restaurantId/orders/checkout",
  isAdminUser,
  completeOrder
);
// orderRouter.get("/restaurants/:restaurantId/orders", isAdminUser, getAllOrders);

export default orderRouter;
