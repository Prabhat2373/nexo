import catchAsyncErrors from "@/middlewares/catchAsyncErrors";
import Table from "@/models/table.model";
import { sendApiResponse } from "@/utils/utils";
import { Request, Response } from "express";

export const addTable = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const { number, qrCode, restaurantId } = req.body;
    const newTable = new Table({ number, qrCode, restaurantId });
    const savedTable = await newTable.save();
    return sendApiResponse(
      res,
      "success",
      savedTable,
      "Table added successfully",
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
