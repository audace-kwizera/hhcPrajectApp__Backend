const express = require("express");
const router = express.Router();
const service = require("./inventory.service");
const auth = require("../../middlewares/auth.middleware");

// 🔥 ADD STOCK
router.post("/add", auth, async (req, res) => {
  try {
    const data = await service.addStock(req.body);
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🔥 GET STOCK
router.get("/:salon_id", auth, async (req, res) => {
  const data = await service.getSalonStock(req.params.salon_id);
  res.json(data);
});

// 🔥 LOW STOCK ALERT
router.get("/alerts/:salon_id", auth, async (req, res) => {
  const data = await service.getLowStock(req.params.salon_id);
  res.json(data);
});

module.exports = router;