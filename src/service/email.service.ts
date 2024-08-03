// import { IInvoice } from "@/models/invoice.model";
// import nodemailer from "nodemailer";
// // import { IInvoice } from "../models/Invoice";

// export const sendInvoiceEmail = async (
//   invoice: IInvoice,
//   filePath: string,
//   customerEmail: string
// ) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: "your-email@gmail.com",
//       pass: "your-email-password",
//     },
//   });

//   const mailOptions = {
//     from: "your-email@gmail.com",
//     to: customerEmail,
//     subject: "Your Invoice",
//     text: "Please find attached your invoice.",
//     attachments: [{ filename: "invoice.pdf", path: filePath }],
//   };

//   await transporter.sendMail(mailOptions);
// };

import nodemailer from "nodemailer";

const sendEmail = async (options: {
  email: string;
  subject: string;
  message: string;
  attachments?: any[];
}) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: options.email,
    subject: options.subject,
    text: options.message,
    attachments: options.attachments,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
