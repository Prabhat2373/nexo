import { loginUser, registerUser } from "@/controllers/account.controller";
import { Router } from "express";

const accountRouter = Router();

accountRouter.post("/login", loginUser);
accountRouter.post("/register", registerUser);

export default accountRouter;
