const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const ExpressError = require("../utils/ExpressError");
const { campgroundJoiSchema } = require("../schemas");
const { isLoggedIn } = require("../middleware");

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

router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

router.post(
  "/",
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash("success", "Successfully made a campground!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const campground = await Campground.findById(id).populate("reviews");
  if (!campground) {
    req.flash("error", "Can't find campground");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
});

router.get("/:id/edit", isLoggedIn, async (req, res) => {
  const id = req.params.id;
  const campground = await Campground.findById(id);
  res.render("campgrounds/edit", { campground });
});

router.put(
  "/:id",
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res) => {
    const id = req.params.id;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    req.flash("success", "Successfully updated campground!");

    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.delete("/:id", isLoggedIn, async (req, res) => {
  const id = req.params.id;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted campground");

  res.redirect("/campgrounds");
});

module.exports = router;
