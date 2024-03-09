const createError = require("http-errors");
const mongoose = require("mongoose");

const Url = require("../models/url.model");
const User = require("../models/user.model");

module.exports.create = (req, res, next) => res.render("urls/shorten");

module.exports.doCreate = (req, res, next) => {
  const urlData = req.body.longUrl;
  const shortId = generateShortUrl();
  Url.create({ longUrl: urlData, shortUrl: shortId })
    .then((url) => {
      res.render("urls/shorten", { shortId: `${req.get("host")}/${shortId}` });
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
