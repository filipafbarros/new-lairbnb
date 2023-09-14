const Property = require("./../models/Property.model");
const catchAsync = require("../utils/catchAsync");
const { setPropertyUserIds } = require("./reviewController");

exports.getOverview = catchAsync(async (req, res) => {
  //1 ) get property data
  const properties = await Property.find();

  res.status(200).render("overview", {
    title: "All Properties",
    properties,
  });
});

exports.getProperty = (req, res) => {
  res.status(200).render("property", {
    title: "Property",
  });
};
