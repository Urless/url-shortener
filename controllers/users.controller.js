const User = require("../models/user.model");
const mongoose = require("mongoose");

module.exports.register = (req, res, next) => {
  res.render("users/register");
};

module.exports.doRegister = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        res.status(409).render("users/register", {
          user: req.body,
          errors: { email: "The account with this email already exists," },
        });
      } else {
        const user = {
          email: req.body.email,
          password: req.body.password,
          username: req.body.username,
        };
        return User.create(user).then(() => res.redirect("/login"));
      }
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res
          .status(400)
          .render("users/register", { user: req.body, errors: error.errors });
      } else {
        next(error);
      }
    });
};

module.exports.login = (req, res, next) => {
  res.render("users/login");
};
