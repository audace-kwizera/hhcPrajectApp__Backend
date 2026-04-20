const express = require("express");
const router = express.Router();
const service = require("./dashboard.service");
const auth = require("../../middlewares/auth.middleware");
const role = require("../../middlewares/role.middleware");
const tenant = require("../../middlewares/tenant.middleware");

// 🔥 GLOBAL STATS (ADMIN ONLY)
router.get("/stats", auth, role("ADMIN"), async (req, res) => {
  const data = await service.getGlobalStats();
  res.json(data);
});

// 🔥 REVENUE BY SALON
router.get("/salons", auth, role("ADMIN"), async (req, res) => {
  const data = await service.getRevenueBySalon();
  res.json(data);
});

// 🔥 TOP CLIENTS
router.get("/clients", auth, role("ADMIN"), async (req, res) => {
  const data = await service.getTopClients();
  res.json(data);
});

// 🔥 LOW STOCK ALERT GLOBAL
router.get("/stock-alerts", auth, role("ADMIN"), async (req, res) => {
  const data = await service.getLowStockGlobal();
  res.json(data);
});

// 🔥 RECENT ORDERS
router.get("/orders", auth, role("ADMIN"), async (req, res) => {
  const data = await service.getRecentOrders();
  res.json(data);
});

// ======================================
// 🔥 SALON DASHBOARD (MULTI-TENANT)
// ======================================

router.get(
  "/salon",
  auth,
  tenant,
  role("ADMIN", "EMPLOYEE", "PARTNER"),
  async (req, res) => {
    try {
      const data = await service.getSalonDashboard(req.tenant);
      res.json(data);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

module.exports = router;