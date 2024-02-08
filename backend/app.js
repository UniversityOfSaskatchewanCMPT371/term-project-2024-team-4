require('reflect-metadata');
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
// const { synchModels } = require("./models");
const dataSource = require('./config/db');

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const catalogueRouter = require("./routes/catalogues");
const regionRouter = require("./routes/regions");
const siteRouter = require("./routes/sites");
const periodRouter = require("./routes/periods");


const bladeShapeRouter = require("./routes/bladeShapes");
const baseShapeRouter = require("./routes/baseShapes");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

// Synchronize models with the database
// synchModels()
//   .then(() => {
//     console.log("Database synchronization complete. Starting server...");
//   })
//   .catch((error) => {
//     console.error("Database synchronization failed:", error);
//   });

app.use("/", indexRouter);
app.use("/users", usersRouter);

app.use("/catalogues", catalogueRouter);
app.use("/regions", regionRouter);
app.use("/sites", siteRouter);
app.use("/periods", periodRouter);

app.use("/bladeshapes", bladeShapeRouter);
app.use("/baseshapes", baseShapeRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
