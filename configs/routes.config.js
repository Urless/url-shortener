const express = require("express");
const url = require("../controllers/urls.controller");
const user = require("../controllers/users.controller");
const secure = require("../middlewares/auth.middleware");

const router = express.Router();

// URL CRUD

router.get("/shorten", url.create);
router.post("/shorten", url.doCreate);

/*
router.get("/url/:id/edit", url.edit);
router.get("/url/:id/edit", url.doEdit); */

router.get("/url/:id/delete", url.delete);

// User CRUD

router.get("/register", user.register);
router.post("/register", user.doRegister);

router.get("/login", user.login);
router.post("/login", user.doLogin);

router.post("/logout", user.logout);

router.get("/dashboard", secure.isAuthenticated, url.list);

router.get("/profile", secure.isAuthenticated, user.edit);
router.post("/profile", secure.isAuthenticated, user.doEdit);

router.get("/:shortUrl", url.doRedirect);

module.exports = router;
