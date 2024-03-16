const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const urlSchema = new Schema(
  {
    longUrl: {
      type: String,
      required: [true, "Long URL is required"],
    },
    owner: {
      type: String,
      ref: "User",
      default: "Anonymous",
    },
    shortUrl: {
      type: String,
    },
    visits: {
      type: Number,
    },
    createdAt: {
      type: Date,
    },
    lifeSpan: {
      type: Number,
      default: 60,
    },
  },
  { timestamps: true }
);

const Url = mongoose.model("Url", urlSchema);
module.exports = Url;
