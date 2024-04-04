require("reflect-metadata");
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const { morganIntegration } = require("./config/logger");
const cors = require("cors");

// const { synchModels } = require("./models");
// const dataSource = require("./config/db");

const healthRouter = require("./routes/health");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const catalogueRouter = require("./routes/catalogues");
const regionRouter = require("./routes/regions");
const siteRouter = require("./routes/sites");
const periodRouter = require("./routes/periods");

const bladeShapeRouter = require("./routes/bladeShapes");
const baseShapeRouter = require("./routes/baseShapes");
const haftingShapeRouter = require("./routes/haftingShapes");
const crossSectionRouter = require("./routes/crossSections");
const cultureRouter = require("./routes/cultures");

const artifactTypeRouter = require("./routes/artifactTypes");
const artifactRouter = require("./routes/artifacts");
const materialRouter = require("./routes/materials");

const aggregateStatisticsGeneratorRouter = require("./routes/aggregateStatisticsGenerators");

const projectilePointsRouter = require("./routes/projectilePoints");

const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(morganIntegration);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Synchronize models with the database
// synchModels()
//   .then(() => {
//     console.log("Database synchronization complete. Starting server...");
//   })
//   .catch((error) => {
//     console.error("Database synchronization failed:", error);
//   });

// Middleware
app.use(bodyParser.json());

// Use CORS middleware
app.use(
	cors({
		origin: "http://localhost:8080", // Replace with your frontend's URL
		methods: ["POST", "GET", "DELETE", "PATCH", "PUT"],
		credentials: true, // Enable credentials (cookies, authorization headers)
	}),
);

app.use("/", healthRouter);
app.use("/", indexRouter);
app.use("/users", usersRouter);

app.use("/catalogues", catalogueRouter);
app.use("/regions", regionRouter);
app.use("/sites", siteRouter);
app.use("/periods", periodRouter);

app.use("/bladeshapes", bladeShapeRouter);
app.use("/baseshapes", baseShapeRouter);
app.use("/haftingshapes", haftingShapeRouter);
app.use("/crosssections", crossSectionRouter);
app.use("/cultures", cultureRouter);

app.use("/artifacttypes", artifactTypeRouter);
app.use("/artifacts", artifactRouter);
app.use("/materials", materialRouter);

app.use("/projectilepoints", projectilePointsRouter);

app.use("/aggregateStatisticsGenerators", aggregateStatisticsGeneratorRouter);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

module.exports = app;
