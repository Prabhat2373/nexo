import Razorpay from "razorpay";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import crypto from "crypto";
import catchAsyncErrors from "@/middlewares/catchAsyncErrors";
import Order from "@/models/order.model";
import { sendApiResponse } from "@/utils/utils";
import { generateInvoicePDF } from "@/service/invoice.service";
import path from "path";

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const initiatePayment = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return sendApiResponse(res, "error", null, "Order not found", 404);
    }

    const options = {
      amount: order.totalAmount * 100, // amount in the smallest currency unit
      currency: "INR",
      receipt: order._id.toString(),
    };

    const razorpayOrder = await razorpay.orders.create(options);

    return sendApiResponse(
      res,
      "success",
      { razorpayOrder, order },
      "Payment initiated",
      200
    );
  }
);

export const handleRazorpayWebhook = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if (digest === req.headers["x-razorpay-signature"]) {
      const event = req.body.event;
      const payload = req.body.payload;

      if (event === "payment.captured") {
        const orderId = payload.payment.entity.receipt;
        const order = await Order.findById(orderId);

        if (order) {
          order.paymentStatus = "paid";
          order.status = "completed";
          await order.save();

          // Generate Invoice
          const invoicePath = path.join(
            __dirname,
            "..",
            "invoices",
            `${order._id}.pdf`
          );
          await generateInvoicePDF(order, invoicePath);

          // Send Invoice via Email
          //   await sendEmail({
          //     email: order.customer.email,
          //     subject: "Your Order Invoice",
          //     message: "Please find attached your order invoice.",
          //     attachments: [
          //       {
          //         filename: `${order._id}.pdf`,
          //         path: invoicePath,
          //         contentType: "application/pdf",
          //       },
          //     ],
          //   });
        }
      }
    }

    res.status(200).json({ status: "ok" });
  }
);

// controllers/orderController.ts

export const confirmCashPayment = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return sendApiResponse(res, "error", null, "Order not found", 404);
    }

    order.paymentStatus = "paid";
    order.status = "completed";
    await order.save();

    // Generate Invoice
    const invoicePath = path.join(
      __dirname,
      "..",
      "invoices",
      `${order._id}.pdf`
    );
    generateInvoicePDF(order, invoicePath);

    // Send Invoice via Email
    // await sendEmail({
    //   email: order.customer.email,
    //   subject: "Your Order Invoice",
    //   message: "Please find attached your order invoice.",
    //   attachments: [
    //     {
    //       filename: `${order._id}.pdf`,
    //       path: invoicePath,
    //       contentType: "application/pdf",
    //     },
    //   ],
    // });

    return sendApiResponse(
      res,
      "success",
      order,
      "Cash payment confirmed",
      200
    );
  }
);
