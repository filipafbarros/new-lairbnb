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

// Get all properties
exports.getAllProperties = catchAsync(async (req, res, next) => {
  // Execute Query
  const features = new APIFeatures(Property.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const properties = await features.query;

  res.status(200).json({
    status: "success",
    results: properties.length,
    data: {
      properties,
    },
  });
});

// Get property
exports.getProperty = catchAsync(async (req, res, next) => {
  const property = await Property.findById(req.params.id).populate("reviews");

  if (!property) {
    return next(new AppError("No property found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      property,
    },
  });
});

// Create property
exports.createProperty = catchAsync(async (req, res, next) => {
  const newProperty = await Property.create(req.body);

  res.status(201).json({ status: "success", data: { property: newProperty } });
});

exports.updateProperty = catchAsync(async (req, res, next) => {
  const property = await Property.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!property) {
    return next(new AppError("No property found with that ID", 404));
  }

  res.status(201).json({ status: "success", data: { property } });
});

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
