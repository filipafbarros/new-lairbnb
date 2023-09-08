const express = require("express");

const propertyController = require("../controllers/propertyController");
const router = express.Router();
const Property = require("../models/Property.model");
const authController = require("./../controllers/authController");

router
  .route("/top-10-cheap")
  .get(
    propertyController.aliasTopProperties,
    propertyController.getAllProperties
  );

router.route("/property-stats").get(propertyController.getPropertyStats);

router
  .route("/")
  .get(authController.protect, propertyController.getAllProperties)
  .post(propertyController.createProperty);

router
  .route("/:id")
  .get(propertyController.getProperty)
  .patch(
    authController.protect,
    authController.restrictTo("host"),
    propertyController.updateProperty
  )
  .delete(
    authController.protect,
    authController.restrictTo("host"),
    propertyController.deleteProperty
  );

module.exports = router;
