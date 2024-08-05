import { RequestType } from "@/constants/AppConstants";
import catchAsyncErrors from "@/middlewares/catchAsyncErrors";
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
      .populate("customerId")
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

    await sendEmail({
      email: order.customerId?.email,
      subject: "Your Order Invoice",
      message: "Please find attached your order invoice.",
      attachments: [
        {
          filename: `${order._id}.pdf`,
          path: invoicePath,
          contentType: "application/pdf",
        },
      ],
    });

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
//     const { tableId, restaurantId } = req?.params;
//     const { items, totalAmount } = req?.body;

//     const customerId = req?.user?.id;

//     const newOrder = await Order.create({
//       tableId,
//       items,
//       totalAmount,
//       restaurantId,
//       customerId,
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
  async (req: RequestType, res: Response, next: NextFunction) => {
    const { tableId, restaurantId } = req.params;
    const { items } = req.body; // items: Array of objects { menuItemId, quantity }

    const customerId = req.user?.id;

    // Initialize total amount
    let totalAmount = 0;

    // Fetch all menu items based on provided item IDs
    const menuItemIds = items.map((item) => item.menuItemId);
    const menuItems = await MenuItem.find({ _id: { $in: menuItemIds } });

    // Create a map of menu items for easy lookup
    const menuItemMap = new Map(
      menuItems.map((item) => [item._id.toString(), item])
    );

    // Calculate total amount
    items.forEach((item) => {
      const menuItem = menuItemMap.get(item.menuItemId.toString());
      if (menuItem) {
        totalAmount += menuItem.price * item.quantity;
      } else {
        // Handle case where menu item is not found
        console.error(`Menu item with ID ${item.menuItemId} not found.`);
        return sendApiResponse(
          res,
          "error",
          null,
          `Menu item with ID ${item.menuItemId} not found.`,
          400
        );
      }
    });

    // Create the order
    const newOrder = await Order.create({
      tableId,
      items,
      totalAmount,
      restaurantId,
      customerId,
    });

    return sendApiResponse(
      res,
      "success",
      newOrder,
      "Order Created Successfully!"
    );
  }
);
export const getAllOrders = catchAsyncErrors(
  async (req: RequestType, res: Response, next: NextFunction) => {
    const restaurantId = req?.params?.restaurantId;
    const allOrders = await Order.find({ restaurantId });

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
      customerId,
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
