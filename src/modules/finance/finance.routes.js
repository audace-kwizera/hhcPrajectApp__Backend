const express = require("express");
const router = express.Router();
const service = require("./finance.service");

const auth = require("../../middlewares/auth.middleware");
const role = require("../../middlewares/role.middleware");

// 🔥 GLOBAL KPI
router.get(
  "/stats",
  auth,
  role("ADMIN"),
  async (req, res) => {
    const data = await service.getFinanceStats();
    res.json(data);
  }
);

// 🔥 GRAPH
router.get(
  "/monthly",
  auth,
  role("ADMIN"),
  async (req, res) => {
    const data = await service.getMonthlyRevenue();
    res.json(data);
  }
);

// 🔥 TOP SALONS
router.get(
  "/salons",
  auth,
  role("ADMIN"),
  async (req, res) => {
    const data = await service.getTopSalons();
    res.json(data);
  }
);

// 🔥 PAYOUT STATUS
router.get(
  "/payouts",
  auth,
  role("ADMIN"),
  async (req, res) => {
    const data = await service.getPayoutOverview();
    res.json(data);
  }
);

module.exports = router;