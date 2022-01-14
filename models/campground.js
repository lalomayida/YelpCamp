const mongoose = require("mongoose");
const Review = require("./review");

const Schema = mongoose.Schema;

const CampgroundSquema = new Schema({
  title: String,
  price: Number,
  images: [
    {
      url: String,
      filename: String,
    },
  ],
  description: String,
  location: String,
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
