const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const urlSchema = new Schema(
  {
    longUrl: {
      type: String,
      required: [true, "Long URL is required"],
    },
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      default: null,// true?
    },
    shortUrl: {
      type: String,
      unique: true,
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
    engagements: {
      type: Number,
    },
  },
  { timestamps: true }
);

const Url = mongoose.model("Url", urlSchema);
module.exports = Url;
