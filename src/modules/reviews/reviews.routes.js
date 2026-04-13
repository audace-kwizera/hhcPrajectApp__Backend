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

// 🔥 ADD REPLY
router.post("/reply", auth, controller.addReply);

// 🔥 GET REVIEWS + REPLIES
router.get("/salon/:salon_id/full", controller.getReviewsWithReplies);

// 🔥 FLAG REVIEW (user)
router.post("/:id/flag", auth, controller.flagReview);

// 🔥 ADMIN
router.get("/admin/flagged", auth, controller.getFlaggedReviews);
router.post("/admin/:id/hide", auth, controller.hideReview);
router.post("/admin/:id/restore", auth, controller.restoreReview);

module.exports = router;