const express = require("express");
const router = express.Router();
const controller = require("./reviews.controller");
const auth = require("../../middlewares/auth.middleware");

// 🔥 CREATE REVIEW
router.post("/", auth, controller.createReview);

// 🔥 GET REVIEWS
router.get("/salon/:salon_id", controller.getSalonReviews);

// 🔥 GET RATING
router.get("/salon/:salon_id/rating", controller.getSalonRating);

module.exports = router;