import { RequestType } from "@/constants/AppConstants";
import catchAsyncErrors from "@/middlewares/catchAsyncErrors";
import Customer from "@/models/customer.model";
import Invoice from "@/models/invoice.model";
import Order from "@/models/order.model";
import { sendInvoiceEmail } from "@/service/email.service";
import { generateInvoicePDF } from "@/service/invoice.service";
import { sendApiResponse } from "@/utils/utils";
import { Request, Response } from "express";
// import Order from "../models/Order";
// import Invoice from "../models/Invoice";
// import { generateInvoicePDF } from "../services/invoiceService";
// import { sendInvoiceEmail } from "../services/emailService";
// import catchAsyncErrors from "../middleware/catchAsyncErrors";
// import sendApiResponse from "../utils/sendApiResponse";

export const createInvoice = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const { orderId, amount } = req.body;

    const order = await Order.findById(orderId);
    if (!order)
      return sendApiResponse(res, "error", null, "Order not found", 404);

    const invoice = new Invoice({
      orderId,
      customerId: order.customerId,
      restaurantId: order.restaurantId,
      amount,
      status: "paid",
    });

    const savedInvoice = await invoice.save();
    const pdfPath = generateInvoicePDF(savedInvoice);

    const customer = await Customer.findById(order.customerId);
    if (customer && customer.email) {
      await sendInvoiceEmail(savedInvoice, pdfPath, customer.email);
    }

    return sendApiResponse(
      res,
      "success",
      savedInvoice,
      "Invoice generated and sent successfully",
      201
    );
  }
);

export const getInvoices = catchAsyncErrors(
  async (req: RequestType, res: Response) => {
    const user = req.user; // Assuming restaurantId is set on req.user by authenticateAdmin
    const restaurantId = user?.restaurantId;
    const invoices = await Invoice.find({ restaurantId });

    return sendApiResponse(
      res,
      "success",
      invoices,
      "Invoices retrieved successfully",
      200
    );
  }
);
