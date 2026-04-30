const express = require("express");
const router = express.Router();

const service = require("./partner.analytics.service");

const auth = require("../../middlewares/auth.middleware");
const tenant = require("../../middlewares/tenant.middleware");
const role = require("../../middlewares/role.middleware");

// 🔥 ANALYTICS
router.get(
  "/analytics",
  auth,
  tenant,
  role("ADMIN", "EMPLOYEE", "PARTNER"),
  async (req, res) => {
    const salon_id = req.tenant.salon_id;

    const [services, products, daily, growth] = await Promise.all([
      service.getTopServices(salon_id),
      service.getTopProducts(salon_id),
      service.getDailyRevenue(salon_id),
      service.getGrowth(salon_id)
    ]);

    res.json({
      top_services: services,
      top_products: products,
      daily_revenue: daily,
      growth
    });
  }
);

module.exports = router;