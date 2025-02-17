const express = require("express");
const router = express.Router();

const {
  getAllRatingsAndReviews,
} = require("../controllers/RatingAndReviews");

// Ratings and reviews
router.get("/all", getAllRatingsAndReviews);

module.exports = router;