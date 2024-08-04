import catchAsyncErrors from "@/middlewares/catchAsyncErrors";
import Table from "@/models/table.model";
import { sendApiResponse } from "@/utils/utils";
import { Request, Response } from "express";
import qrcode from "qrcode";

// export const addTable = catchAsyncErrors(
//   async (req: Request, res: Response) => {
//     const { number, qrCode, restaurantId } = req.body;
//     const newTable = new Table({ number, qrCode, restaurantId });
//     const savedTable = await newTable.save();
//     return sendApiResponse(
//       res,
//       "success",
//       savedTable,
//       "Table added successfully",
//       201
//     );
//   }
// );

// // Add a new table and generate a QR code for it
// export const addTable = catchAsyncErrors(
//   async (req: Request, res: Response) => {
//     const { number, restaurantId } = req.body;

//     const newTable = new Table({ number, restaurantId });
//     const savedTable = await newTable.save();

//     // Generate QR code
//     const qrUrl = `https://www.restaurantname.myplatform.com/table/${savedTable._id}`;
//     const qrCode = await qrcode.toDataURL(qrUrl);

//     // Save the QR code to the table
//     savedTable.qrCode = qrCode;
//     await savedTable.save();

//     return sendApiResponse(
//       res,
//       "success",
//       savedTable,
//       "Table added successfully",
//       201
//     );
//   }
// );

// Add multiple tables by specifying the number of tables
export const addMultipleTables = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const { restaurantId } = req.params;
    const numberOfTables = parseInt(req.params.number, 10);

    if (isNaN(numberOfTables) || numberOfTables <= 0) {
      return sendApiResponse(
        res,
        "error",
        null,
        "Invalid number of tables",
        400
      );
    }

    const savedTables = await Promise.all(
      Array.from({ length: numberOfTables }).map(async (_, index) => {
        const newTable = new Table({ number: index + 1, restaurantId });
        const savedTable = await newTable.save();

        // Generate QR code
        const qrUrl = `${process.env.FRONTEND_URL}/restaurants/${restaurantId}/tables/${savedTable._id}`;
        const qrCode = await qrcode.toDataURL(qrUrl);

        // Save the QR code to the table
        savedTable.qrCode = qrCode;
        await savedTable.save();

        return savedTable;
      })
    );

    return sendApiResponse(
      res,
      "success",
      savedTables,
      "Tables added successfully",
      201
    );
  }
);

export const getTables = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const { restaurantId } = req.params;
    const tables = await Table.find({ restaurantId });
    return sendApiResponse(
      res,
      "success",
      tables,
      "Tables fetched successfully",
      200
    );
  }
);

export const updateTableStatus = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const { tableId } = req.params;
    const { state } = req.body;

    if (!["free", "in_use"].includes(state)) {
      return sendApiResponse(res, "error", null, "Invalid status", 400);
    }

    const table = await Table.findById(tableId);
    if (!table) {
      return sendApiResponse(res, "error", null, "Table not found", 404);
    }

    table.state = state;
    const updatedTable = await table.save();
    return sendApiResponse(
      res,
      "success",
      updatedTable,
      "Table status updated successfully",
      200
    );
  }
);
