require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

// Configurations

require("./configs/hbs.config");
require("./configs/db.config");

const app = express();

// Serve static file

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "hbs");
app.set("views", `${__dirname}/views`);

// Middlewares

app.use(bodyParser.urlencoded({ extended: true }));

// App routes

const routes = require("./configs/routes.config");
app.use("/", routes);
app.get("/", (req, res) => {
  res.render("misc/home");
});

const port = 3000;
app.listen(port, () => console.info(`App running at port ${port}`));
