const express = require("express");
const url = require("../controllers/url.controller");
const user = require("../controllers/user.controller");

const router = express.Router();

// URL CRUD

router.get("/", url.create);
router.post("/", url.doCreate);
/*  router.get("/url", url.list);

router.get("/url/:id/edit", url.edit);
router.get("/url/:id/edit", url.doEdit);

router.get("/url/:id/delete", url.delete);
router.get("/url/:id/delete", url.doDelete);

// User CRUD

router.get("/register", user.register);
router.post("/register", user.doRegister);

router.get("/login", user.login);
router.post("/login", user.doLogin);

router.get("/profile", user.detail);

router.get("/logout", url.logout);
router.get("/logout", url.doLogout); */

module.exports = router;
