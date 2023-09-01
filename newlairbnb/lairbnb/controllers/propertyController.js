const Property = require("../models/Property.model");
const express = require("express");

// Get all properties
exports.getAllProperties = async (req, res) => {
  try {
    // Build Query
    // 1) Filtering
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 2) Advanced filtering
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    let query = await Property.find(JSON.parse(queryString));

    // 3) Sorting
    if (req.query.sort) {
      const sortBy = req.quary.sort.split(",".join(" "));
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // 4) Limiting fields

    if (req.query.fields) {
      const fields = req.query.fields.split(",".join(" "));
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    // Execute Query
    const properties = await query;

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
