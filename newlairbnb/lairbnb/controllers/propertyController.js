const Property = require("../models/Property.model");
const express = require("express");

// Get all properties
exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find();

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
