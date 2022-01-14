"use strict";
const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 200; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20);

    const newCamp = new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      images: [
        {
          url:
            "https://res.cloudinary.com/dqtj7rqhv/image/upload/v1642133201/YelpCamp/omj90gju0dbwu6fdgywf.jpg",
          filename: "YelpCamp/omj90gju0dbwu6fdgywf",
        },
        {
          url:
            "https://res.cloudinary.com/dqtj7rqhv/image/upload/v1642133200/YelpCamp/tfbfqlseho5vpokvxycg.jpg",
          filename: "YelpCamp/tfbfqlseho5vpokvxycg",
        },
      ],
      author: "61e078d352bdf80b0faac1e9",
      description:
        "Lorem ips u dolor sit amet consectetur adipisicing elit. Nobis est accusamus fugit molestiae accusantium sint ipsa. Accusantium officia perferendis rem ex sunt nostrum. Nesciunt eaque soluta porro praesentium quasi voluptate?",
      price: price,
    });
    await newCamp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
