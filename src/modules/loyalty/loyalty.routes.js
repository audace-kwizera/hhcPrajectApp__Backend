const express = require("express");
const router = express.Router();
const service = require("./loyalty.service");

router.post("/add", async (req, res) => {
  const { user_id, points } = req.body;
  const data = await service.addPoints(user_id, points);
  res.json(data);
});

router.get("/:user_id", async (req, res) => {
  const data = await service.getPoints(req.params.user_id);
  res.json(data);
});

module.exports = router;