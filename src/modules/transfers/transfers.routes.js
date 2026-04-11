const express = require("express");
const router = express.Router();
const service = require("./transfers.service");
const auth = require("../../middlewares/auth.middleware");

// 🔥 TRANSFER STOCK
router.post("/", auth, async (req, res) => {
  try {
    const data = await service.transferStock(req.body);
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🔥 GET TRANSFERS
router.get("/", auth, async (req, res) => {
  const data = await service.getTransfers();
  res.json(data);
});

module.exports = router;