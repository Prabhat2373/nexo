import { RequestType } from "@/constants/AppConstants";
import catchAsyncErrors from "@/middlewares/catchAsyncErrors";
import Coupon from "@/models/coupon.model";
import MenuItem from "@/models/menuItem.model";
import Order from "@/models/order.model";
import sendEmail from "@/service/email.service";
import { generateInvoicePDF } from "@/service/invoice.service";
import { sendApiResponse } from "@/utils/utils";
import { NextFunction } from "express";
import path from "path";

export const completeOrder = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const { orderId } = req.body;

    const order = await Order.findById(orderId)
      .populate("customer")
      .populate("restaurantId")
      .populate("items.menuItemId");

    if (!order) {
      return sendApiResponse(res, "error", null, "Order not found", 404);
    }

    order.status = "completed";
    await order.save();

    const invoicePath = path.join(
      __dirname,
      "..",
      "invoices",
      `${order._id}.pdf`
    );
    generateInvoicePDF(order, invoicePath);

    // await sendEmail({
    //   email: order.customer?.email,
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
      "Order completed and invoice sent",
      200
    );
  }
);

// export const createOrder = catchAsyncErrors(
//   async (req: RequestType, res: Response, next: NextFunction) => {
//     const { tableId, restaurantId } = req.params;
//     const { items } = req.body; // items: Array of objects { menuItemId, quantity }

//     const customerId = req.user?.id;

//     // Initialize total amount
//     let totalAmount = 0;

//     // Fetch all menu items based on provided item IDs
//     const menuItemIds = items.map((item) => item.menuItemId);
//     const menuItems = await MenuItem.find({ _id: { $in: menuItemIds } });

//     // Create a map of menu items for easy lookup
//     const menuItemMap = new Map(
//       menuItems.map((item) => [item._id.toString(), item])
//     );

//     // Calculate total amount
//     items.forEach((item) => {
//       const menuItem = menuItemMap.get(item.menuItemId.toString());
//       if (menuItem) {
//         totalAmount += menuItem.price * item.quantity;
//       } else {
//         // Handle case where menu item is not found
//         console.error(`Menu item with ID ${item.menuItemId} not found.`);
//         return sendApiResponse(
//           res,
//           "error",
//           null,
//           `Menu item with ID ${item.menuItemId} not found.`,
//           400
//         );
//       }
//     });

//     // Create the order
//     const newOrder = await Order.create({
//       table: tableId,
//       items,
//       totalAmount,
//       restaurantId,
//       customer: customerId,
//     });

//     return sendApiResponse(
//       res,
//       "success",
//       newOrder,
//       "Order Created Successfully!"
//     );
//   }
// );

export const createOrder = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { tableId, restaurantId } = req.params;
    const { items, couponCode } = req.body;

    const customerId = req?.user?.id;

    // Calculate subTotal
    let subTotal = 0;
    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItem);
      if (menuItem) {
        subTotal += menuItem.price * item.quantity;
      }
    }

    // Apply coupon if available
    let couponAmount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode,
        restaurantId: restaurantId,
        validFrom: { $lte: new Date() },
        validTo: { $gte: new Date() },
      });
      if (coupon) {
        couponAmount = (subTotal * coupon.percentage) / 100;
      }
    }

    const subTotalAfterCoupon = subTotal - couponAmount;

    // Calculate tax, platform fee, and other charges
    const tax = (subTotalAfterCoupon * Number(process.env.TAX_RATE)) / 100; // Example: 10% tax
    const platformFee = (subTotalAfterCoupon * 2) / 100; // Example: 2% platform fee
    const otherCharges = Number(process.env.OTHER_CHARGES); // Example: Fixed other charges

    // Calculate total amount
    const totalAmount = subTotalAfterCoupon + tax + platformFee + otherCharges;

    const newOrder = await Order.create({
      tableId,
      items,
      subTotal,
      coupon: couponAmount,
      tax,
      platformFee,
      otherCharges,
      totalAmount,
      restaurantId,
      customerId,
    });

    return sendApiResponse(
      res,
      "success",
      newOrder,
      "Order created successfully",
      201
    );
  }
);
export const getAllOrders = catchAsyncErrors(
  async (req: RequestType, res: Response, next: NextFunction) => {
    const restaurantId = req?.params?.restaurantId;
    const allOrders = await Order.find({ restaurantId }).populate(
      "table customer"
    );

    return sendApiResponse(
      res,
      "success",
      allOrders,
      "Orders Fetched Successfully"
    );
  }
);

export const fetchOrdersByCustomer = catchAsyncErrors(
  async (req: RequestType, res: Response) => {
    const restaurantId = req?.params?.restaurant;
    const customerId = req?.user?.id;

    const customerOrders = await Order.find({
      customer: customerId,
      restaurantId,
    });

    return sendApiResponse(
      res,
      "success",
      customerOrders,
      "Orders Found Successfully"
    );
  }
);

export const getOrderSummary = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate("customer")
      .populate("restaurantId")
      .populate("items.menuItemId");

    if (!order) {
      return sendApiResponse(res, "error", null, "Order not found", 404);
    }

    return sendApiResponse(res, "success", order, "Order summary fetched", 200);
  }
);
