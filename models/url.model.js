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
      default: null, // true?
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
  {
    timestamps: true,
    virtuals: {
      removalDate: {
        get() {
          const expiration = new Date(this.createdAt);
          expiration.setDate(expiration.getDate() + this.lifeSpan);
          return expiration;
        },
      },
    },
  }
);

urlSchema.set("toObject", { getters: true });

const Url = mongoose.model("Url", urlSchema);

module.exports.cleanUrl = () => {
  const today = new Date();
  Url.deleteMany({
    owner: null,
    $expr: { $lt: [{ $add: ["$createdAt", "$lifeSpan"] }, today] },
  })
    .then((url) => {
      // add controller and redirect to the url created
      console.log("url", url);
    })
    .catch((error) => {
      console.error("error", error);
    });
};

module.exports.Url = Url;
