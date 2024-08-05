// routes/paymentRoutes.ts

import { handleRazorpayWebhook } from "@/controllers/payment.controller";
import express from "express";
// import { handleRazorpayWebhook } from "../controllers/paymentController";

const paymentRouter = express.Router();

paymentRouter.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleRazorpayWebhook
);

export default paymentRouter;
