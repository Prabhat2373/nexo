import { createInvoice, getInvoices } from "@/controllers/invoice.controller";
import { isAuthenticatedUser } from "@/middlewares/Auth";
import catchAsyncErrors from "@/middlewares/catchAsyncErrors";
import { Router } from "express";
// import { createInvoice, getInvoices } from "../controllers/adminController";
// import catchAsyncErrors from "../middleware/catchAsyncErrors";
// import authenticateAdmin from "../middleware/authenticateAdmin";

const invoiceRouter = Router();

// invoiceRouter.use(isAuthenticatedUser);

invoiceRouter.post("/invoice", createInvoice);
invoiceRouter.get("/invoices", getInvoices);

export default invoiceRouter;
