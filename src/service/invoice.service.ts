import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { IInvoice } from "@/models/invoice.model";
// import { IInvoice } from "../models/Invoice";

export const generateInvoicePDF = (invoice: IInvoice) => {
  const doc = new PDFDocument();
  const filePath = path.join(__dirname, `../invoices/${invoice._id}.pdf`);
  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(20).text("Invoice", { align: "center" });
  doc.text("----------------------------------------");
  doc.fontSize(14).text(`Invoice ID: ${invoice._id}`);
  doc.text(`Order ID: ${invoice._id}`);
  doc.text(`Customer ID: ${invoice.customer?.id}`);
  doc.text(`Restaurant ID: ${invoice.restaurantId}`);
  doc.text(`Amount: $${invoice.totalAmount}`);
  doc.text(`Status: ${invoice.status}`);
  doc.text("----------------------------------------");

  doc.end();
  return filePath;
};
