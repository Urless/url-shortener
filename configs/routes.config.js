const express = require("express");
const url = require("../controllers/urls.controller");
const user = require("../controllers/users.controller");
const secure = require("../middlewares/auth.middleware");

const router = express.Router();

// URL CRUD

router.get("/shorten", url.create);
router.post("/shorten", url.doCreate);

/*  router.get("/url", url.list);

router.get("/url/:id/edit", url.edit);
router.get("/url/:id/edit", url.doEdit);

router.get("/url/:id/delete", url.delete);
router.get("/url/:id/delete", url.doDelete); */

// User CRUD

router.get("/register", user.register);
router.post("/register", user.doRegister);

router.get("/login", user.login);
router.post("/login", user.doLogin);

router.get("/dashboard", secure.isAuthenticated, user.dashboard);

/* router.get("/profile", user.detail); */

module.exports.logout = (req, res, next) => {
  req.session.destroy();
  req.session = null;
  res.clearCookie("connect.sid");
  res.redirect("/login");
};

module.exports = router;
