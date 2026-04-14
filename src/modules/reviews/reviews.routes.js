const express = require("express");
const router = express.Router();
const controller = require("./reviews.controller");
const auth = require("../../middlewares/auth.middleware");
const checkRole = require("../../middlewares/role.middleware");

// 🔥 CREATE REVIEW → USER ONLY
router.post("/", auth, checkRole("USER"), controller.createReview);

// 🔥 GET REVIEWS (public)
router.get("/salon/:salon_id", controller.getSalonReviews);

// 🔥 GET RATING (public)
router.get("/salon/:salon_id/rating", controller.getSalonRating);

// 🔥 ADD REPLY → SALON ONLY
router.post("/reply", auth, checkRole("SALON"), controller.addReply);

// 🔥 GET REVIEWS + REPLIES
router.get("/salon/:salon_id/full", controller.getReviewsWithReplies);

// 🔥 FLAG REVIEW → USER
router.post("/:id/flag", auth, checkRole("USER"), controller.flagReview);

// 🔥 ADMIN ONLY
router.get("/admin/flagged", auth, checkRole("ADMIN"), controller.getFlaggedReviews);

router.post("/admin/:id/hide", auth, checkRole("ADMIN"), controller.hideReview);

router.post("/admin/:id/restore", auth, checkRole("ADMIN"), controller.restoreReview);

module.exports = router;