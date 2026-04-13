const service = require("./reviews.service");

const createReview = async (req, res) => {
  try {
    const data = await service.createReview(req.body);
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getSalonReviews = async (req, res) => {
  const data = await service.getSalonReviews(req.params.salon_id);
  res.json(data);
};

const getSalonRating = async (req, res) => {
  const data = await service.getSalonRating(req.params.salon_id);
  res.json(data);
};

const addReply = async (req, res) => {
  try {
    const data = await service.addReply(req.body);
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getReviewsWithReplies = async (req, res) => {
  const data = await service.getSalonReviewsWithReplies(
    req.params.salon_id
  );
  res.json(data);
};


// 🔥 FLAG
const flagReview = async (req, res) => {
  const data = await service.flagReview(req.params.id);
  res.json(data);
};

// 🔥 ADMIN
const getFlaggedReviews = async (req, res) => {
  const data = await service.getFlaggedReviews();
  res.json(data);
};

const hideReview = async (req, res) => {
  const data = await service.hideReview(req.params.id);
  res.json(data);
};

const restoreReview = async (req, res) => {
  const data = await service.restoreReview(req.params.id);
  res.json(data);
};

module.exports = {
  createReview,
  getSalonReviews,
  getSalonRating,
  addReply,
  getReviewsWithReplies,
  flagReview,
  getFlaggedReviews,
  hideReview,
  restoreReview
};