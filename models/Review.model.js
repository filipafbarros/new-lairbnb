const mongoose = require("mongoose");
const Property = require("./Property.model");
const User = require("./User.model");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review can not be empty!"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    property: {
      type: mongoose.Schema.ObjectId,
      ref: "Property",
      required: [true, "Review must belong to a property."],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "firstName photo",
  });
  next();
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
