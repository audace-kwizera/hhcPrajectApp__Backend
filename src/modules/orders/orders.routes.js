const express = require("express");
const router = express.Router();
const service = require("./orders.service");
const auth = require("../../middlewares/auth.middleware");

router.post("/", auth, async (req, res) => {
  try {
    const order = await service.createOrder(req.body);
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", auth, async (req, res) => {
  const data = await service.getOrders();
  res.json(data);
});

module.exports = router;