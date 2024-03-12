require("dotenv").config();

const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const createError = require("http-errors");

const authMiddleware = require("./middlewares/auth.middleware");

// Configurations
require("./configs/hbs.config");
require("./configs/db.config");

const app = express();

// Serve static file
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "hbs");
app.set("views", `${__dirname}/views`);

// App Middlewares
app.use(express.static(`${__dirname}/public`));
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));

// Sessions Middleware
const { session, loadUserSession } = require("./configs/session.config");
app.use(session);
app.use(loadUserSession);

// App routes
const routes = require("./configs/routes.config");
app.use("/", routes);
app.get("/", (req, res) => {
  res.render("misc/home");
});

app.use((req, res, next) => next(createError(404, "Route not found")));

app.use((error, req, res, next) => {
  if (
    error instanceof mongoose.Error.CastError &&
    error.message.includes("_id")
  ) {
    error = createError(404, "Resource not found");
  } else if (!error.status) {
    error = createError(500, error);
  }
  console.error(error);
  res.status(error.status).render(`errors/${error.status}`);
});

const port = 3000;
app.listen(port, () => console.info(`App running at port ${port}`));
