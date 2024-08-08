import { RequestType } from "@/constants/AppConstants";
import catchAsyncErrors from "@/middlewares/catchAsyncErrors";
import UserAccount, { IUserAccount, UserRole } from "@/models/account.model";
import Restaurant from "@/models/restaurant.model";
import sendToken from "@/utils/jwtToken";
import { sendApiResponse } from "@/utils/utils";
import { NextFunction, Request, Response } from "express";

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

// export const getProfile = catchAsyncErrors(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const { id } = req.params;
//     const userProfile = await UserAccount.findById(id);

//     return sendApiResponse(
//       res,
//       "success",
//       userProfile,
//       "Profile fetched successfully"
//     );
//   }
// );

export const getProfile = catchAsyncErrors(
  async (req: RequestType, res: Response) => {
    if (req.user) {
      console.log("requestuser", req.user);
      // Fetch user account without password
      const userAccount = await UserAccount.findById(req.user.id)
        .select("-password")
        .exec();

      if (!userAccount) {
        return sendApiResponse(res, "error", null, "User not found", 400);
      }

      let account = userAccount;

      if (userAccount.role == UserRole.ADMIN) {
        const restaurant = await Restaurant.findOne({
          email: userAccount?.email,
        });
        console.log("restaurant", restaurant);
        account.restaurant = restaurant;
      }
      console.log("account", account);
      return sendApiResponse(
        res,
        "success",
        account, // Return the combined object
        "User found successfully"
      );
    } else {
      return sendApiResponse(res, "error", {}, "Account not found", 401);
    }
  }
);
