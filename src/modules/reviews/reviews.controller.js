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

module.exports = {
  createReview,
  getSalonReviews,
  getSalonRating
};