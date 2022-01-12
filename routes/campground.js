const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const ExpressError = require("../utils/ExpressError");
const { campgroundJoiSchema } = require("../schemas");

const validateCampground = (req, res, next) => {
  const { error } = campgroundJoiSchema.validate(req.body);

  if (error) {
    const message = error.details.map((err) => err.message).join(",");
    throw new ExpressError(message, 400);
  } else {
    next();
  }
};

router.get("/", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});

router.get("/new", (req, res) => {
  res.render("campgrounds/new");
});

router.post(
  "/",
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const campground = await Campground.findById(id).populate("reviews");
  res.render("campgrounds/show", { campground });
});

router.get("/:id/edit", async (req, res) => {
  const id = req.params.id;
  const campground = await Campground.findById(id);
  res.render("campgrounds/edit", { campground });
});

router.put(
  "/:id",
  validateCampground,
  catchAsync(async (req, res) => {
    const id = req.params.id;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  await Campground.findByIdAndDelete(id);
  res.redirect("/campgrounds");
});

module.exports = router;
