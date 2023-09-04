// ℹ️ Gets access to environment variables/settings

const viewRouter = require("./routes/view.routes");
const propertyRouter = require("./routes/property.routes");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// default value for title local
const capitalize = require("./utils/capitalize");
const projectName = "lairbnb";

app.locals.appTitle = `${capitalize(projectName)} created with IronLauncher`;

// ROUTES
app.use("/", viewRouter);
app.use("/api/v1/properties", propertyRouter);
// app.use("/api/v1/users", userRouter);
// app.use("/api/v1/reviews", reviewRouter);
// app.use("/api/v1/bookings", bookingRouter);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`));
});

app.use(globalErrorHandler);

module.exports = app;
