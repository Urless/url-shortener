const createError = require("http-errors");
const mongoose = require("mongoose");

const Url = require("../models/url.model");
const User = require("../models/user.model");

module.exports.create = (req, res, next) => res.render("misc/home");

module.exports.doCreate = (req, res, next) => {
  const urlData = req.body.url;
  const shortId = generateShortUrl();
  Url.create({ originalUrl: urlData, shortUrl: shortId })
    .then((url) => {
      res.json({ shortUrl: `${process.env.WEB_DOMAIN}${url.shortUrl}` });
    })
    .catch((error) => {
      res.json(error);
    });
};

function generateShortUrl() {
  return Array.from({ length: 8 }, () => Math.random().toString(36)[2]).join(
    ""
  );
}
