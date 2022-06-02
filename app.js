require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const errorMiddleware = require("./middlewares/error");
const notfoundMiddleware = require("./middlewares/notfound");
const authRoute = require("./routes/authRoute");

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/auth", authRoute);

app.use(errorMiddleware);
app.use(notfoundMiddleware);

app.listen(process.env.PORT || 8000, () =>
  console.log(`Sever is running on port ${process.env.PORT}`)
);
