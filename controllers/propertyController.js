const Property = require("../models/Property.model");
const express = require("express");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require("./handlerFactory");

exports.aliasTopProperties = async (req, res, next) => {
  req.query.limit = "10";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,description,location";
  next();
};

// Factory Functions
exports.getAllProperties = factory.getAll(Property);
exports.getProperty = factory.getOne(Property, { path: "reviews" });
exports.createProperty = factory.createOne(Property);
exports.updateProperty = factory.updateOne(Property);
exports.deleteProperty = factory.deleteOne(Property);

exports.getPropertyStats = catchAsync(async (req, res, next) => {
  const stats = await Property.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: null,
        numProperties: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    { $sort: { avgPrice: 1 } },
  ]);

  res.status(200).json({ status: "success", data: { stats } });
});
