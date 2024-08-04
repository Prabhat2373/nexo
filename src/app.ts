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
import restaurantRouter from "./routes/admin/restaurant.routes";

const app: Application = express();

app.use(corsConfig);

import { Server } from "socket.io";
import http from "http";
import invoiceRouter from "./routes/admin/invoice.routes";
import accountRouter from "./routes/customer/account.routes";
import orderRouter from "./routes/customer/order.routes";
import menuRouter from "./routes/admin/menu.routes";

const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("join_restaurant", (restaurantId) => {
    socket.join(restaurantId); // Join room for specific restaurant
  });

  socket.on("new_order", (order) => {
    io.to(order.restaurantId).emit("order_update", order); // Emit to specific restaurant room
  });
});

server.listen(8002, () => {
  console.log("Server is listening on port 8002");
});

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
// app.get("/api/v1/", (req, res) => {
//   return res.json({
//     message: "Hello",
//   });
// });

app.use("/api/v1", accountRouter);
app.use("/api/v1", restaurantRouter);
app.use("/api/v1", invoiceRouter);
app.use("/api/v1", orderRouter);
app.use("/api/v1", menuRouter);

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
