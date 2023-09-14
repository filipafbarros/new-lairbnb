// We reuse this import in order to have access to the `body` property in requests
const express = require("express");

// ℹ️ Responsible for the messages you see in the terminal as requests are coming in
// https://www.npmjs.com/package/morgan
const logger = require("morgan");

// ℹ️ Needed when we deal with cookies (we will when dealing with authentication)
// https://www.npmjs.com/package/cookie-parser
const cookieParser = require("cookie-parser");

// ℹ️ Serves a custom favicon on each request
// https://www.npmjs.com/package/serve-favicon
const favicon = require("serve-favicon");

// ℹ️ global package used to `normalize` paths amongst different operating systems
// https://www.npmjs.com/package/path
const path = require("path");

// Additional Imports
const cors = require("cors");
const multer = require("multer");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

//

// Middleware configuration
module.exports = (app) => {
  // In development environment the app logs
  app.use(logger("dev"));

  // To have access to `body` property in the request

  const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "too many requests from this IP, please try again in 1h",
  });

  app.use("/api", limiter);

  app.use(helmet());

  app.use(express.json());

  // data sanitization
  app.use(mongoSanitize());

  // data sanitization against xss
  app.use(xss());

  //prevent paramenter pollution
  app.use(
    hpp({
      whitelist: ["ratingsQuantity", "ratingsAverage", "maxGuests", "price"],
    })
  );

  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  // Normalizes the path to the views folder
  app.set("views", path.join(__dirname, "..", "views"));
  // Sets the view engine to pug
  app.set("view engine", "pug");
  // Handles access to the public folder
  app.use(express.static(path.join(__dirname, "..", "public")));

  app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
  });

  // Handles access to the favicon
  app.use(favicon(path.join(__dirname, "..", "public", "img", "favicon.png")));
};
