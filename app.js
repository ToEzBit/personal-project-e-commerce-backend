require("dotenv").config();
require("./config/passport");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const errorMiddleware = require("./middlewares/error");
const notfoundMiddleware = require("./middlewares/notfound");
const passportJwtMiddleware = require("./middlewares/passportJwt");
const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");
const productRoute = require("./routes/productRoute");
const commentRoute = require("./routes/commentRoute");
const orderRoute = require("./routes/orderRoute");

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/auth", authRoute);
app.use("/users", passportJwtMiddleware, userRoute);
app.use("/admins", adminRoute);
app.use("/products", productRoute);
app.use("/comments/", passportJwtMiddleware, commentRoute);
app.use("/orders", passportJwtMiddleware, orderRoute);

app.use(errorMiddleware);
app.use(notfoundMiddleware);

app.listen(process.env.PORT || 8000, () =>
  console.log(`Sever is running on port ${process.env.PORT}`)
);
