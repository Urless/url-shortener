const createError = require("http-errors");
const mongoose = require("mongoose");

const Url = require("../models/url.model");
const User = require("../models/user.model");

module.exports.create = (req, res, next) => res.render("urls/shorten");

module.exports.doCreate = (req, res, next) => {
  const urlData = req.body.longUrl;
  const customUrl = req.body.customUrl;

  if (process.env.RESERVEDKEYWORDS.includes(customUrl)) {
    return res.render("urls/shorten", {
      error: "This URL is not available. Please choose a different one.",
    });
  }

  // Check if the custom URL already exists in the database
  Url.findOne({ shortUrl: customUrl })
    .then((existingUrl) => {
      if (existingUrl) {
        return res.render("urls/shorten", {
          error: "This URL already exists. Please choose a different one.",
        });
      } else {
        let shortId;

        if (customUrl) {
          shortId = customUrl;
        } else {
          shortId = generateShortUrl();
        }
        return Url.create({ longUrl: urlData, shortUrl: shortId }).then(
          (url) => {
            // add controller and redirect to the url created
            res.render("urls/shorten", {
              shortId: `${req.get("host")}/${shortId}`,
            });
          }
        );
      }
    })
    .catch(next);
};

module.exports.list = (req, res, next) => {
  const { longUrl, shortUrl, createdAt, lifeSpan } = req.query;
  const criterial = {};
  if (shortUrl) criterial.shortUrl = new RegExp(shortUrl, "i");

  Url.find(criterial)
    .sort({ createdAt: "asc" })
    .then((urls) => res.render("users/dashboard", { urls }))
    .catch((error) => next(error));
};

function generateShortUrl() {
  return Array.from({ length: 8 }, () => Math.random().toString(36)[2]).join(
    ""
  );
}
