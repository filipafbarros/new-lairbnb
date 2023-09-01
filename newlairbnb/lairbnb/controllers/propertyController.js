const Property = require("../models/Property.model");
const express = require("express");
const APIFeatures = require("../utils/apiFeatures");

exports.aliasTopProperties = async (req, res, next) => {
  req.query.limit = "10";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,description,location";
  next();
};

// Get all properties
exports.getAllProperties = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

// Get property
exports.getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    res.status(200).json({
      status: "success",
      data: {
        property,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

// Create property
exports.createProperty = async (req, res) => {
  try {
    const newProperty = await Property.create(req.body);

    res
      .status(201)
      .json({ status: "success", data: { property: newProperty } });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(201).json({ status: "success", data: { property } });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.deleteProperty = async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: "success", data: null });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getPropertyStats = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
