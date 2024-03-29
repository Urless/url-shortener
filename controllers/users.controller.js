const User = require("../models/user.model");
const mongoose = require("mongoose");

const { sessions } = require("../middlewares/auth.middleware");
const { create } = require("connect-mongo");

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
        console.log(req.body);
      } else {
        next(error);
      }
    });
};

module.exports.login = (req, res, next) => {
  res.render("users/login");
};

module.exports.doLogin = (req, res, next) => {
  User.findOne({ username: req.body.username })
    .then((user) => {
      if (!user) {
        res.status(401).render("users/login", {
          user: req.body,
          errors: { password: "Invalid username or password" },
        });
      } else {
        return user.checkPassword(req.body.password).then((match) => {
          if (match) {
            req.session.userId = user.id;
            res.redirect("/dashboard");
          } else {
            res.status(401).render("users/login", {
              user: req.body,
              errors: { password: "Invalid username or password" },
            });
          }
        });
      }
    })
    .catch(next);
};

module.exports.dashboard = (req, res, next) => {
  const cookieHeader = req.headers.cookie;
  const sessionId = cookieHeader.split("sessionId=")[1];
  console.log(req.get("host"));
  console.log(req);
  res.render("users/dashboard", {
    isLoggedIn: !!req.session.userId,
    domain: req.get("host"),
  });
};

module.exports.edit = (req, res, next) => {
  res.render("users/profile", { user: req.session.userId });
};

module.exports.doEdit = (req, res, next) => {
  if (!req.body.password) delete req.body.password
  
  const user = Object.assign(req.user, req.body);
  user.save() 
  .then(() => res.redirect('/profile'))
  .catch((error) => {
    if (error instanceof mongoose.Error.ValidationError) {
      res
        .status(400)
        .render("users/profile", { user: req.body, errors: { password: "Invalid username or password" }})
        } else {
      next(error);
    } 
  })

}; 

module.exports.logout = (req, res, next) => {
  req.session.destroy();
  req.session = null;
  res.clearCookie("connect.sid");
  res.redirect("/login");
};

module.exports.delete = (req, res, next) => {
  const id = req.params.id;
  User.findByIdAndDelete(id)
    .then((user) => {
      if (!user) {
        next(createError(404, 'User not found'))
      } else {
        res.redirect('/register');
      }
    })
    .catch((error) => next(error));
} 


