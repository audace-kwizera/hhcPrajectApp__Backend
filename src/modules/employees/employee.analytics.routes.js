const express = require("express");
const router = express.Router();

const service = require("./employee.analytics.service");

const auth = require("../../middlewares/auth.middleware");
const tenant = require("../../middlewares/tenant.middleware");
const role = require("../../middlewares/role.middleware");

// 🔥 EMPLOYEE ANALYTICS
router.get(
  "/employees",
  auth,
  tenant,
  role("EMPLOYEE", "PARTNER"),
  async (req, res) => {
    const salon_id = req.tenant.salon_id;

    const [revenue, performance] = await Promise.all([
      service.getEmployeeRevenue(salon_id),
      service.getEmployeePerformance(salon_id)
    ]);

    res.json({
      ranking: revenue,
      performance
    });
  }
);

module.exports = router;