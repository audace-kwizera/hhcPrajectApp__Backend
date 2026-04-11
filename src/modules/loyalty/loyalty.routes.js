// const express = require("express");
// const router = express.Router();
// const service = require("./loyalty.service");

// router.post("/add", async (req, res) => {
//   const { user_id, points } = req.body;
//   const data = await service.addPoints(user_id, points);
//   res.json(data);
// });

// router.get("/:user_id", async (req, res) => {
//   const data = await service.getPoints(req.params.user_id);
//   res.json(data);
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const service = require("./loyalty.service");
const auth = require("../../middlewares/auth.middleware");

// 🔥 ADD POINTS (protégé)
router.post("/add", auth, async (req, res) => {
  try {
    const { user_id, points } = req.body;
    const data = await service.addPoints(user_id, points);
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🔥 GET MY POINTS
router.get("/me", auth, async (req, res) => {
  const data = await service.getPoints(req.user.id);
  res.json(data);
});

// 🔥 ADMIN ONLY (optionnel)
router.get("/:user_id", auth, async (req, res) => {
  const data = await service.getPoints(req.params.user_id);
  res.json(data);
});

module.exports = router;