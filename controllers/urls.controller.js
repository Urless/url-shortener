const createError = require("http-errors");
const mongoose = require("mongoose");

const { Url } = require("../models/url.model");
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

        // Modified to set the owner only if the user is authenticated
        const owner = req.user ? req.user._id : null;

        return Url.create({
          longUrl: urlData,
          shortUrl: shortId,
          owner: owner,
        })
          .then((url) => {
            // add controller and redirect to the url created
            res.render("urls/shorten", {
              shortId: `${req.get("host")}/${shortId}`,
            });
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send("Internal Server Error");
          });
      }
    })
    .catch(next);
};

module.exports.list = (req, res, next) => {
  const { longUrl, shortUrl, createdAt, lifeSpan } = req.query;
  const criterial = {};
  if (shortUrl) criterial.shortUrl = new RegExp(shortUrl, "i");

  Url.find({ owner: req.session.userId })
    .sort({ createdAt: "asc" })
    .then((urls) =>
      res.render("users/dashboard", { urls, domain: req.get("host") })
    )
    .catch((error) => next(error));
};

function generateShortUrl() {
  return Array.from({ length: 8 }, () => Math.random().toString(36)[2]).join(
    ""
  );
}

// Redirecting users

module.exports.doRedirect = (req, res, next) => {
  Url.findOne({ shortUrl: req.params.shortUrl })
    .then((url) => {
      if (!url) {
        console.log("URL not found for ID:", req.params.shortUrl);
        return res.redirect("/");
      }
      console.log("Redirecting to:", url.longUrl);
      return res.redirect(url.longUrl);
    })
    .catch((error) => {
      console.error("Error while finding URL by ID:", error);
      return res.redirect("/");
    });
};

module.exports.delete = (req, res, next) => {
  const url = req.params.shortUrl;
  Url.findById(url)
    .then((url) => {
      if (!url) {
        next(createError(404, "Url not found"));
      } else {
        return Url.deleteOne({ _id: shortUrl }).then(() =>
          res.redirect("/dashboard")
        );
      }
    })
    .catch((error) => next(error));
};
