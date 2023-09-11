const express = require("express");
const router = express.Router();

const reviewRouter = require("./review.routes");
const propertyController = require("../controllers/propertyController");
const authController = require("./../controllers/authController");

router.use("/:propertyId/reviews", reviewRouter);

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

// router
//   .route("/:propertyId/reviews")
//   .post(
//     authController.protect,
//     authController.restrictTo("user"),
//     reviewController.createReview
//   );

module.exports = router;
