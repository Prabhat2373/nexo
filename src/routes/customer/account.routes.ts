import {
  getProfile,
  loginUser,
  registerUser,
} from "@/controllers/account.controller";
import { isAuthenticatedUser } from "@/middlewares/Auth";
import { Router } from "express";

const accountRouter = Router();

accountRouter.get("/profile", isAuthenticatedUser, getProfile);
accountRouter.post("/login", loginUser);
accountRouter.post("/register", registerUser);

export default accountRouter;
