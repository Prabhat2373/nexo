import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application } from "express";
import { download } from "./helper/downloadImage";
import { ErrorMiddleware } from "./middlewares/error";
// import { companyRoutes } from "./routes/company.routes";
import session from "express-session";
import corsConfig from "./config/cors.config";

import passport from "passport";

const app: Application = express();

app.use(corsConfig);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true },
  })
);

app.use(passport.authenticate("session"));

// ROUTES
app.get("/api/v1/", (req, res) => {
  return res.json({
    message: "Hello",
  });
});

app.get("/api/v1/files/:name", download);
app.get("/api/v1/uploads/:name", download);
// TEST ONLY
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "connection success!",
  });
});

app.get("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "NO ROUTE FOUND!",
  });
});

app.use(ErrorMiddleware);
export default app;
