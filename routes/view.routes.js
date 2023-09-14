const express = require("express");
const router = express.Router();
const viewsController = require("./../controllers/viewsController");

router.get("/", viewsController.getOverview);
router.get("/property", viewsController.getProperty);

module.exports = router;
