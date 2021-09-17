const dotenv = require("dotenv");
dotenv.config();

const logger = require("morgan");
const express = require("express");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");

const app = express();

app.use(logger("dev"));
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const index = require("./routes");

app.use("/", index);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
});

module.exports = app;
