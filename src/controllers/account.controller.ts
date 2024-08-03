import catchAsyncErrors from "@/middlewares/catchAsyncErrors";
import UserAccount, { IUserAccount, UserRole } from "@/models/account.model";
import sendToken from "@/utils/jwtToken";
import { sendApiResponse } from "@/utils/utils";
import { Request, Response } from "express";

export const registerUser = catchAsyncErrors(
  async (req: Request, res: Response) => {
    // await Upload(req, res);
    const { name, email, password } = req.body;
    // Create a new user account
    console.log("file", req.files);

    const userAccount: IUserAccount = new UserAccount({
      name,
      email,
      password,
      role: UserRole.CUSTOMER,
    });
    console.log("userAccount", userAccount);

    // Save the user account to the database
    const savedUserAccount = await userAccount.save();

    sendToken(savedUserAccount, savedUserAccount, 200, res);
  }
);

export const loginUser = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    console.log("email", email);

    // Find the user account by email
    const userAccount = await UserAccount.findOne({
      email,
    });

    console.log("userAccount", userAccount);

    // If the user account doesn't exist, return an error
    if (!userAccount) {
      // return res.status(401).json({ error: "Invalid email or password" });
      return sendApiResponse(
        res,
        "error",
        null,
        "Invalid email or password",
        401
      );
    }

    // Check if the password matches
    const isMatch = await userAccount.comparePassword(password);
    if (!isMatch) {
      // return res.status(401).json({ error: "Invalid email or password" });
      return sendApiResponse(
        res,
        "error",
        null,
        "Invalid email or password",
        401
      );
    }

    sendToken(userAccount, userAccount, 200, res);
  }
);
