const express = require("express");
const router = express.Router();

const service = require("./partner.service");

const auth = require("../../middlewares/auth.middleware");
const role = require("../../middlewares/role.middleware");
const tenant = require("../../middlewares/tenant.middleware");

// 🔥 DASHBOARD PARTNER
router.get(
  "/dashboard",
  auth,
  tenant,
  role("EMPLOYEE", "PARTNER"),
  async (req, res) => {
    const data = await service.getPartnerDashboard(
      req.tenant.salon_id
    );
    res.json(data);
  }
);

module.exports = router;