const express = require("express");

const propertyController = require("../controllers/propertyController");
const router = express.Router();
const Property = require("../models/Property.model");

router
  .route("/top-10-cheap")
  .get(
    propertyController.aliasTopProperties,
    propertyController.getAllProperties
  );

router.route("/property-stats").get(propertyController.getPropertyStats);

router
  .route("/")
  .get(propertyController.getAllProperties)
  .post(propertyController.createProperty);

router
  .route("/:id")
  .get(propertyController.getProperty)
  .patch(propertyController.updateProperty)
  .delete(propertyController.deleteProperty);

module.exports = router;
