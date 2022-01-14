const mongoose = require("mongoose");
const Review = require("./review");

const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_300");
});

const CampgroundSquema = new Schema({
  title: String,
  price: Number,
  images: [ImageSchema],
  description: String,
  location: String,
  geometry: {
    type: { type: String, enum: ["Point"], required: true },
    coordinates: { type: [Number], required: true },
  },
  author: { type: Schema.Types.ObjectId, ref: "User" },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

CampgroundSquema.post("findOneAndDelete", async (campground) => {
  if (campground) {
    await Review.deleteMany({
      id: {
        $in: campground.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Campground", CampgroundSquema);
