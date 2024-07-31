import { IInvoice } from "@/models/invoice.model";
import nodemailer from "nodemailer";
// import { IInvoice } from "../models/Invoice";

export const sendInvoiceEmail = async (
  invoice: IInvoice,
  filePath: string,
  customerEmail: string
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "your-email@gmail.com",
      pass: "your-email-password",
    },
  });

  const mailOptions = {
    from: "your-email@gmail.com",
    to: customerEmail,
    subject: "Your Invoice",
    text: "Please find attached your invoice.",
    attachments: [{ filename: "invoice.pdf", path: filePath }],
  };

  await transporter.sendMail(mailOptions);
};
